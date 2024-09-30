import React,{useState} from "react";
import authService from "../appwrite/auth";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { Button, Input, Logo } from "./index.js"
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";


function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const {register, handleSubmit, formState: { errors }} = useForm();

    const create = async(data) => {
        setError("");
        try {
            const createdUserData = await authService.createAccount(data);
            if(createdUserData) {
                //create session
                const session = await authService.createSession(data.email, data.password);

                //fetch the current user(only if the session was successfully created)
                const currentUserData = await authService.getCurrentUser();

                if(currentUserData) {
                    dispatch(login(currentUserData));
                    navigate("/");
                } else {
                    setError("Unable to retrive user information after login");
                }
            }
        } catch (error) {
            setError(error.message || "An error occurred during signup");
        }
    };

    return (
        <div className="flex items-center justify-center">
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
             <div className="mb-2 flex justify-center">
                <span className="inline-block w-full max-w-[100px]">
                    <Logo width="100%" />
                </span>
                </div>   
                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link 
                       to="/login"
                       className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>    
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                <form onSubmit={handleSubmit(create)}>
                    <div className="space-y-5">
                        <Input 
                        label="Full name: "
                        placeholder="Enter your full name"
                        {...register("name",{
                           required: "Name is required", 
                        })}
                        />
                        {errors.name && <p className="text-red-600">{errors.name.message}</p>}

                        <Input 
                        label="Email: "
                        placeholder="Enter your email"
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                message: "Email address must be valid"
                            }
                        })} 
                        />
                        {errors.email && <p className="text-red-600">{errors.email.message}</p>}

                        <Input 
                        label="Password: "
                        type="password"
                        placeholder="Enter your password"
                        {...register("password",{
                            required: true,
                        })}
                        />
                        {errors.password && <p className="text-red-600">{errors.password.message}</p>}

                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup;