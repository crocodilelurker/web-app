const { uploadFileTOCloudinary } = require("../config/cloudinaryConfig.js");
const Conversation = require("../models/Conversation.js");
const Message = require("../models/Message.js")
const response = require("../utils/responseHandler.js");

const sendMessage = async (req, res) => {
    try {
        const {  receiverId, content, messageStatus } = req.body;
        const file = req.file;
        const senderId = req.user.userId;
        const participants = [senderId, receiverId].sort();
        let conversation = await Conversation.findOne({ participants: participants });
        if (!conversation) {
            conversation = new Conversation({ participants: participants });
        }
        await conversation.save();
        let imageOrVideoUrl = null;
        let contentType = null;
        //handle uploading via cloudinaty
        if (file) {
            const uploadFile = await uploadFileTOCloudinary(file);
            if (!uploadFile?.secure_url) {
                return response(res, 500, "File Upload failed")
            }
            imageOrVideoUrl = uploadFile?.secure_url;
            if (file.mimetype.startsWith("image")) {
                contentType = "image";
            }
            else if (file.mimetype.startsWith("video")) {
                contentType = "video";
            }
            else {
                return response(res, 400, "Unsupported File");
            }
        } else if (content?.trim()) {
            contentType = "text";
        }
        else {
            return response(res, 400, "Message content or file is required");
        }
        const message = new Message({
            conversation: conversation?._id,
            sender: senderId,
            receiver: receiverId,
            content: content || null,
            contentType: contentType || "text",
            imageOrVideoUrl: imageOrVideoUrl || null,
            messageStatus: messageStatus || "sent"
        })
        await message.save();
        if (message?.content)
            conversation.lastMessage = message?._id;

        conversation.unreadCount = (conversation.unreadCount || 0) + 1;

        await conversation.save();
        const populatedMessage = await Message.findOne(message?._id).populate("sender", "username profilePicture").populate("receiver", "username profilePicture");



        //socket io
        return response(res, 201, "Message Sent Successfully", populatedMessage);
    } catch (error) {
        console.error(error);
        return response(res, 500, "Internal Server Error messageController.js");
    }
}



const getConversation = async (req, res) => {
    try {
        const userId = req.user.userId;
        let conversation = await Conversation.findOne({ participants: userId }).populate("participants", "username profilePicture isOnline lastSeen").populate({
            path: "lastMessage",
            populate: {
                path: "sender receiver",
                select: "username profilePicture"
            }
        }).sort({ updatedAt: -1 });
        return response(res, 201, "Conversation get ", conversation);
    } catch (error) {
        console.error(error);
        return response(res, 501, "ISP");
    }
}
//30343

const getMessages = async (req, res) => {
    const { conversationId } = req.params;
    const userId = req.user.userId;
    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.includes(userId)) {
            return response(res, 404, "Not found or not authorized");
        }
        const messages = await Message.find({ conversation: conversationId })
            .populate("sender", "username profilePicture")
            .populate("receiver", "username profilePicture")
            .sort({ createdAt:-1 });
        await Message.updateMany({
            conversation: conversationId,
            receiver: userId,
            messageStatus: { $in: ["sent", "delivered"] }
        },
            {
                $set: { messageStatus: "read" }
            });


        conversation.unreadCount = 0;
        await conversation.save();

        return response(res, 201, "Message Success Fetched", messages);
    } catch (error) {

        console.error(error);
        return response(res, 501, "ISP");
    }
}

const markAsRead = async (req, res) => {
    const userId = req.user.userId;
    const {messageIds} = req.body;

    try {
        let messages = await Message.find({
            _id:{$in:messageIds},
            receiver:userId

        })

        await Message.updateMany({
            _id:{$in : messageIds},
                receiver:userId,
            }
            ,{
                $set:{messageStatus:"read"}
            });
            return response(res,201,"Messages marked as read successfully");
    } catch (error) {
        console.error(error);
        return response(res, 501, "ISP");
    }
}

const deleteMessage = async (req,res) => {
    const {messageId} = req.params;
    const userId = req.user.userid;
    try {
        const message = await Message.findById(messageId);
        if(!message)
        {
            return response (res, 404, "Message not found");
        }
        if(message.sender.toString() !== userId)
        {
            return response (res,403,"Not authorized to delete this message");
        }
        await message.deleteOne();
        return response (res,200,"Message deleted successfully");
    } catch (error) {
        console.error(error);
        return response(res, 501, "ISP");
    }
}
module.exports = { sendMessage, getConversation, getMessages, markAsRead, deleteMessage };