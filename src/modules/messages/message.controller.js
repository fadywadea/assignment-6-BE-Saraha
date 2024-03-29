"use strict";

import { messageModel } from "../../../database/models/messages.model.js";
import { userModel } from "../../../database/models/users.model.js";
import { catchError } from "../../middleware/catchError.js";
import { appError } from "../../utils/appError.js";
import QRcode from "qrcode";

// Add Message
export const addMessage = catchError(async (req, res, next) => {
  const { received } = req.body;
  const user = await userModel.findOne({ _id: received });
  if (user) {
    const { message } = req.body;
    const x = await messageModel.insertMany({ message, received });
    res.status(201).json({ message: "success", x });
  } else {
    next(new appError("User not found.", 404));
  }
});

// All Messages
export const getAllMessages = catchError(async (req, res, next) => {
  const user = await userModel.findOne({ _id: req.params.id });
  if (user) {
    const messages = await messageModel.find({ received: req.params.id });
    messages.length
      ? res.status(200).json({ data: messages })
      : next(new appError("No messages found.", 404));
  } else {
    next(new appError("User not found.", 404));
  }
});

// Share Profile
export const shareProfile = catchError(async (req, res) => {
  QRcode.toDataURL("http://localhost:3001/api/v1/message", (error, qr) => {
    res.status(200).send(`<img src="${qr}"/>`);
  });
});
