import { Types } from "mongoose";
import { PipelineBuilder } from "../utils/pipelineBuilder";
export default class PostPipeline {
  public static getAllPost(
    id: Types.ObjectId,
    page: number,
    pageSize: number,
    searchQuery?: string,
    sortBy?: string
  ): any[] {
    const builder = new PipelineBuilder()
      .match({ author: id })
      .lookup("users", "author", "_id", "author")
      .unwind("$author")
      .project({
        _id: 0,
        title: 1,
        content: 1,
        author: "$author.username",
        numberOfLikes: { $size: "$likes" },
        numberOfComments: { $size: "$comments" },
      })
      .paginate(page, pageSize);
    if (searchQuery) {
      builder.match({
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { content: { $regex: searchQuery, $options: "i" } },
          { author: { $regex: searchQuery, $options: "i" } },
        ],
      });
    }

    if (sortBy) {
      builder.sort(sortBy);
    }
    return builder.build();
  }
  public static getPost(id: Types.ObjectId, title: string): any[] {
    const builder = new PipelineBuilder()
      .match({ author: id, title: title })
      .lookup("users", "author", "_id", "author")
      .unwind("$author")
      .project({
        _id: 0,
        title: 1,
        content: 1,
        author: "$author.username",
        numberOfLikes: { $size: "$likes" },
        numberOfComments: { $size: "$comments" },
      });
    return builder.build();
  }
}
