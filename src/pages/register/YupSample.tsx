import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./sample.css"

// validation yup schema object//

const schema = yup.object({
  username: yup
    .string()
    .required("Username is required"),

  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  age: yup
    .number()
    .typeError("Age must be a number")
    .min(18, "You must be at least 18")
    .required("Age is required"),
});


//type interface//

type FormValues = yup.InferType<typeof schema>;

// hook useform setup//


const YupSample = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }, 
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // submit function//

  const onSubmit = (data: FormValues) => {
    console.log("Form Data:", data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate
     style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",     
    justifyContent: "center",
    minHeight: "100vh",       
    gap: "12px",
  }}
  >
      {/* Username */}
      <div>
        <label>Username</label>
        <input {...register("username")} />
        <p className="errors">{errors.username?.message}</p>
      </div>

      {/* Email */}
      <div>
        <label>Email</label>
        <input type="email" {...register("email")} />
        <p className="errors">{errors.email?.message}</p>
      </div>

      {/* Password */}
      <div>
        <label>Password</label>
        <input type="password" {...register("password")} />
        <p className="errors">{errors.password?.message}</p>
      </div>

      {/* Age */}
      <div>
        <label>Age</label>
        <input type="number" {...register("age")} />
        <p className="errors">{errors.age?.message}</p>
      </div>

      {/* Submit */}
      <button type="submit">
        Submit
      </button>
    </form>
  );
};

export default YupSample;
