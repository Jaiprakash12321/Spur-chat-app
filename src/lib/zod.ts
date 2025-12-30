import { z } from 'zod'

export const SignUpSchema = z.object({
    username: z.string().min(3, {message: 'username must be atleast 3 letters long'}).max(25, {message: 'username cannot be more than 10 letters'}).trim(),
    email: z.string().email({message: 'Please enter a valid email'}).trim(),
    password: z.string().min(8, {message: 'Password must be atleast 8 letters long'}).max(15)
              .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/, {message: 'Password must contain atleast one special char and one number'}).trim()
})  

export const SignInSchema = z.object({
    email: z.string().email({message: 'Please enter a valid email'}).trim(),
    password: z.string().min(8, {message: 'Password must be atleast 8 letters long'}).max(15, { message: 'Password cannot exceed 15 characters'})
              .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/, {message: 'Password must contain atleast one special char and one number'}).trim()
})

// .max(1500, { message: 'Prompt too long !'})
export const createMessageSchema = z.object({ message: z.string().min(1, { message: 'Enter a message!'})})

export const updateTitleSchema = z.object({title: z.string().min(1, "Title cannot be empty").max(60, "Title too long")})