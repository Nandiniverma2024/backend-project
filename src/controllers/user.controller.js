import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js'; 
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';

const registerUser=asyncHandler( async(req,res) => {
    // Get user details from frontend
    // Validate those details
    // Check if user exist or not (with help of email and userName)
    // ask user to upload avatar Image(which it mandatory)
    // check if avatar Image uploaded on cloudinary sucessfully
    // Now, create an object in DB(db return things as it is, we don't want password(which is already encrypted) and refresh Token(which is empty) to be shown to user)
    // so, remove password and refresh Token field from response
    // Now, check if user is created successfully, if yes
    // Return response


    const {userName, fullName, email, passWord}=req.body;
    console.log("email:", email);
    console.log("passWord:", passWord);

    // 2. validation
    // (field) => field?.trim()==="" => trim krne ke bad bi field khali h return true(mltb vo fiel khali h to return error)
    if(
        [fullName, email, userName, passWord].some((field) => field?.trim()==="")
    ){
        throw new ApiError(404, "All fields are required");
    }

    //3. Check if user already exist or not
    const existedUser=User.findOne({
        $or: [{userName}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or UserName already exists");
    }

    // 4. ask user to upload avatar Image(which it mandatory)
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    // 5. check if avatar Image uploaded on cloudinary sucessfully
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400, "Avatar file is required");
    }

    // 6. Now, create an object in DB
    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage: coverImage?.url || "", //agr coverImage h to usme se url nikal lo nhi to coverImage ko empty hi rhne do
        email,
        passWord,
        userName:userName.toLowerCase(),
    })
    

    // 7. Remove password and refresh Token field from response

    // .select -> teel jo field nhi chahiye, kuki bydefault sare field selected hote h (jiske aage negative i.e - => vo field nhi chahiye)
    const createdUser=await User.findById(user.id).select(
        "-passwrod -refreshToken"
    )

    // 8. Now, check if user is created successfully or not
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // 9. Return response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    );
    
})

// http://localhost:8000/api/v1/users/register -> get msg on this localhost link


export { registerUser };
