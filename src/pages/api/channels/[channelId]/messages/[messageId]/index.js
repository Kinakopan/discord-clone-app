import { getMessageById, updateMessageById, deleteMessageById } from "@/database";

export default async function handler(req, res) {
  const { messageId } = req.query;

  switch (req.method) {
    // case "GET":
      // Get a message by ID
      // res
      //   .status(200)
      //   .json({ message: "GET request to /api/channels/[channelId]/messages/[messageId] not implemented yet" });
      // break;

    case 'GET':
      // Get a single channel by id
      const message = await getMessageById(messageId);
      if (!message) {
        res.status(404).json({ message: "Message not found" });
        break;
      }
      res.status(200).json(message);
      break;

    // case "PUT":
    //   // Update a message by ID
    //   res
    //     .status(200)
    //     .json({ message: "PUT request to /api/channels/[channelId]/messages/[messageId] not implemented yet" });
    //   break;

    case "PUT":
      // Update a channel by id
      const { text } = req.body;
      if (!text) {
        res.status(400).json({ message: "Missing channel message" });
        break;
      }
      const updatedMessage = await updateMessageById(messageId, text);
      if (!updatedMessage) {
        res.status(404).json({ message: "Message not found" });
        break;
      }
      res.status(200).json(updatedMessage);
      break;


    // case "DELETE":
    //   // Delete a message by ID
    //   res
    //     .status(200)
    //     .json({ message: "DELETE request to /api/channels/[channelId]/messages/[messageId] not implemented yet" });
    //   break;

    case "DELETE":
      // Delete a channel by id
      await deleteMessageById(messageId);
      res.status(204).end();
      break;

    default:
      res.status(405).end();
  }
}
