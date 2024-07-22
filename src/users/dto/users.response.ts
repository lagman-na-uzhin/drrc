import {type User} from "../entity/users.entity";

// HttpResponse will be general and will be located above, but for now the test task is here
export interface HttpResponse {
    statusCode: number;
    message: string;
}

export interface UserResponse extends HttpResponse{
    user?: User
}
