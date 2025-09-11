const { uploadFileTOCloudinary } = require("../config/cloudinaryConfig.js");
const Conversation = require("../models/Conversation.js");
const Message = require("../models/Message.js")
const response = require("../utils/responseHandler.js");

const sendMessage = async (req,res) => {
    try {
        const {senderId,receiverId, content , messageStatus } = req.body;
        const file = req.file;

        const participants = [senderId , receiverId].sort();
        let conversation = await Conversation.findOne({participants:participants});
        if(!conversation)
        {
            conversation = new Conversation({participants:participants});
        }
        await conversation.save();
        let imageOrVideoUrl = null;
        let contentType = null;
        //handle uploading via cloudinaty
        if(file)
        {
            const uploadFile = await uploadFileTOCloudinary(file);
            if(!uploadFile?.secure_url)
            {
                return response(res,500,"File Upload failed")
            }
            imageOrVideoUrl = uploadFile?.secure_url;
            if(file.mimetype.startsWith("image"))
            {
                contentType = "image";
            }
            else if(file.mimetype.startsWith("video"))
            {
                contentType = "video";
            }
            else
            {
                return response(res,400,"Unsupported File");
            }
        }else if(content?.trim())
        {
            contentType = "text";
        }
        else {
            return response(res,400,"Message content or file is required");
        }
        const message = new Message({
            conversationId : conversation?._id,
            sender : senderId,
            receiver : receiverId,
            content : content || null,
            contentType : contentType || "text",
            imageOrVideoUrl : imageOrVideoUrl || null,
            messageStatus:messageStatus || "sent"
        })
        await message.save();
        if(message?.content)
        conversation.lastMessage = message?._id;
       
        conversation.unreadCount = (conversation.unreadCount || 0)+1;

        await conversation.save();
        const populatedMessage = await Message.findOne(message?._id).populate("sender","username profilePicture").populate("receiver","username profilePicture");



        //socket io
        return response(res,201,"Message Sent Successfully",populatedMessage);
    } catch (error) {
        console.error(error);
        return response(res,500,"Internal Server Error messageController.js");
    }
}
//30343
module.exports = sendMessage;