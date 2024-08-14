import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class SaveUserIdGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user['id']; // Assuming the user ID is stored in the 'id' property of the user object
    request.userId = userId;
    // Save the user ID to a database or any other storage mechanism
    // You can perform any additional logic here before saving the user ID

    return true; // Return true to allow access to the route
  }
}
