import Poll from "../model/pollModal.js";
import AppError from "../utils/appError.js";
import { savePoll } from "../repository/pollRepository.js";
import { getPoll } from "../repository/pollRepository.js";
import { updatePoll } from "../repository/pollRepository.js";
import { AdminModal } from "../model/adminModal.js";
import { comparePassword } from "../utils/passwordService.js";
import { hashPassword } from "../utils/passwordService.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../services/jwtService.js";
import { attachTokenCookie } from "../services/attachCookie.js";

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      throw AppError.conflict("Missing Email Address");
    }
    if (!password) {
      throw AppError.conflict("Missing Password");
    }

    const adminDetals = await AdminModal.findOne({ emailAddress: email });

    if (!adminDetals) {
      throw AppError.conflict("No admin details found");
    }

    const comparedPassword = await comparePassword(
      password,
      adminDetals.password
    );

    if (!comparedPassword) {
      throw AppError.validation("Incorrect Password");
    }

    const accessToken = generateAccessToken(adminDetals._id);
    if (!accessToken) {
      throw AppError.conflict("Error creating access token");
    }

    const refreshToken = generateRefreshToken(adminDetals._id);
    if (!refreshToken) {
      throw AppError.conflict("Error creating refresh token");
    }

    console.log(accessToken, "AccessToken");
    console.log(refreshToken, "RefreshToken");

    attachTokenCookie("AccessToken", accessToken, res);
    attachTokenCookie("RefreshToken", refreshToken, res);

    res.status(200).json({
      adminDetals,
    });
  } catch (error) {
    next(error);
  }
};

export const adminRegister = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email) {
      throw AppError.conflict("Missing Email Address");
    }
    if (!password) {
      throw AppError.conflict("Missing Password");
    }
    if (!name) {
      throw AppError.conflict("Missing Name");
    }

    const existingAdmin = await AdminModal.findOne({ emailAddress: email });
    if (existingAdmin) {
      throw AppError.validation("Email Already Registered as Admin");
    }

    const hashedPassword = await hashPassword(password);

    const newAdmin = await AdminModal.create({
      emailAddress: email,
      password: hashedPassword,
      name: name,
      role: "admin",
    });

    if (newAdmin) {
      const accessToken = generateAccessToken(newAdmin._id);
      const refreshToken = generateRefreshToken(newAdmin._id);

      attachTokenCookie("AccessToken", accessToken, res);
      attachTokenCookie("RefreshToken", refreshToken, res);
    }

    return res.status(201).json({
      message: "Admin registration successful",
      adminDetails: {
        id: newAdmin._id,
        email: newAdmin.emailAddress,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const createPoll = async (req, res, next) => {
  try {
    const { pollDetail } = req.body;
    console.log(pollDetail, "pollDetail");
    if (!pollDetail) {
      throw AppError.conflict("error Creating new Poll");
    }
    pollDetail.options = pollDetail.options.map((option) => ({
      text: option,
      votes: 0,
    }));
    const poll = await savePoll(pollDetail);

    res.status(200).json({ poll });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getPolls = async (req, res, next) => {
  try {
    const polls = await getPoll();

    const now = new Date();

    const formattedPolls = polls.map((poll) => {
      const createdAt = new Date(poll.createdAt);
      const pollEndTime = new Date(createdAt.getTime() + poll.duration * 60000);
      const isActive = now < pollEndTime;

      return {
        id: poll._id.toString(),
        title: poll.title,
        isPrivate: poll.isPrivate,
        description: poll.description,
        totalVotes: poll.options.reduce((acc, option) => acc + option.votes, 0),
        isActive,
        options: poll.options.map((option) => ({
          text: option.text,
          votes: option.votes,
        })),
      };
    });
    console.log(formattedPolls, "formattedPOlls");

    return res.status(200).json({ formattedPolls });
  } catch (error) {
    console.error("Error fetching polls:", error);
    next(error);
  }
};

export const updatePolls = async (req, res, next) => {
  try {
    const { pollId, pollDetails } = req.body;

    await updatePoll(pollId, pollDetails);
    console.log("Poll updated successfully");

    return await getPolls(req, res, next);
  } catch (error) {
    console.error("Error updating poll:", error);
    next(error);
  }
};
