import { ObjectId } from "mongoose";
import { PipelineBuilder } from "../utils/pipelineBuilder";
import User from "../model/user.model";

export default class UserPipeline {
  public static listOfRequests(
    id: ObjectId,
    page: number,
    pageSize: number,
    searchQuery?: string,
    sortBy?: string
  ): any[] {
    const builder = new PipelineBuilder()
      .match({ _id: id })
      .lookup("users", "requests", "_id", "requests")
      .lookup("users", "followers", "_id", "followers")
      .lookup("users", "following", "_id", "following")
      .project({
        _id: 0,
        requests: "$requests.username",
        followers: "$followers.username",
        following: "$following.username",
      })
      .paginate(page, pageSize);

    if (searchQuery) {
      builder.match({
        $or: [
          { requests: { $regex: searchQuery, $options: "i" } },
          { followers: { $regex: searchQuery, $options: "i" } },
          { following: { $regex: searchQuery, $options: "i" } },
        ],
      });
    }

    if (sortBy) {
      builder.sort(sortBy);
    }
    return builder.build();
  }

  public static userData(id: ObjectId): any[] {
    const builder = new PipelineBuilder().match({ _id: id }).project({
      _id: 0,
      username: 1,
      email: 1,
    });
    return builder.build();
  }
}
