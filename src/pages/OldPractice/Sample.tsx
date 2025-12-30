import { useForm, useFieldArray} from "react-hook-form";
import type { FieldErrors } from "react-hook-form";
import "../register/sample.css";
import { useEffect } from "react";

//field type//

type FormValues = {
  username: string;
  email: string;
  phoneno: string;
  website: string;
  social: {
    twitter: string;
    instagram: string;
  };
  phoneNumbers: string[];
  phNumbers: {
    number: string;
  }[];
  age: number;
  DOB:Date;
  
  
};
//use form setup//

const Sample = () => {
  const form = useForm<FormValues>({
    //form controller manage form state values validation error submit handling not usestate//
    mode: "onChange",
    defaultValues: {
      //default values set and nested objects
      username: "vino",
      email: "",
      phoneno: "",
      website: "",
      social: {
        twitter: "",
        instagram: "",
      },
      phoneNumbers: ["", ""],
      phNumbers: [{ number: "" }],
      age: 0,
      DOB:new Date(),
    },
      
  });

  //form helpers destructring//

  const { 
    register, 
    control, 
    handleSubmit, 
    formState, 
    reset,
    watch,
    getValues,
    setValue,
    trigger } = form; 

    //formstate//

  const { 
    errors,
    touchedFields,
    dirtyFields,
    isDirty,
    isValid,
    isSubmitting,
    isSubmitted,
    isSubmitSuccessful,
    submitCount } = formState;

  console.log({isSubmitting,isSubmitted,isSubmitSuccessful,submitCount});
  console.log({touchedFields,dirtyFields,isDirty});

  //dynamic inputs usefield array//

  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    control,
  });

  //form submission//

  const onSubmit = (data: FormValues) => {
    console.log("form submitted", data);

    reset();
    
  };
 const onError = (errors: FieldErrors<FormValues>) => {
  console.log("form error", errors);
};

//watching values//

  const watchemail = watch("email");

  //get current getvalues//

  const handleGetValues = ()=>{
    console.log("getvalues",getValues(["username","email"]));
  }

  //set value username//

  const handleSetValue = () => {
  setValue("username", "", {
    shouldValidate: true,
    shouldDirty: true,
    shouldTouch: true,
  });
};
//Reset after submit//
useEffect(()=>{
  if(isSubmitSuccessful){
    reset();
  }
},[isSubmitSuccessful,reset]);

  return (
    
    <form
      onSubmit={handleSubmit(onSubmit,onError)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      
      noValidate
      
    >
       <h2>watched value:{watchemail}</h2>
      <div>
      
        <label>Username</label>
       
        <br />
        <input
          type="text"
          id="username"
          {...register("username", {
            required: {
              value: true,
              message: "username is required",
            },
          })}
          placeholder="Enter username"
        />
        <p className="error">{errors.username?.message}</p>
      </div>


      <div>
        <label>Email</label>
        <br />
        <input
          type="email"
          id="email"
          {...register("email", {
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "invalid email format",
            },
            validate: {
              //react custom validation//
              notAdmin: (fieldValue) => {
                return (
                  fieldValue !== "admin@example.com" ||
                  "Enter Different email address"
                );
              },
            },
          })}
          placeholder="Enter email"
        />
        <p className="error">{errors.email?.message}</p>
      </div>

      <div>
        <label>Phoneno</label>
        <br />
        <input
          type="tel"
          id="phoneno"
          {...register("phoneno", {
            required: {
              value: true,
              message: "phoneno is required",
            },
          })}
          placeholder="Enter phone number"
        />
        <p className="error">{errors.phoneno?.message}</p>
      </div>
      <div>
        <label>Website</label>
        <br />
        <input
          type="tel"
          id="website"
          {...register("website", {
            required: {
              value: true,
              message: "website is required",
            },
          })}
          placeholder="https://www.example.com"
        />
        <p className="error">{errors.website?.message}</p>
      </div>
      

      <div>
        <label>twitter</label>
        <br />
        <input type="url" id="twitter" {...register("social.twitter")} />
      </div>
      <br />
      <div>
        <label>Instagram</label>
        <br />
        <input
          type="url"
          id="Instagram"
          {...register("social.instagram")}
          placeholder=""
        />
      </div>
      <br />
      <div>
        <label>Primary Phone number</label>
        <br />
        <input type="tel" id="phoneno1" {...register("phoneNumbers.0")} />
      </div>
      <br />
      <div>
        <label>Secondary Phone number</label>
        <br />
        <input
          type="tel"
          id="phoneno2"
          {...register("phoneNumbers.1")}
          placeholder=""
        />
      </div>
      <br />

      <label>List of Phone Numbers</label>

      {fields.map((field, index) => {
        return (
          <div key={field.id}>
            <input
              type="text"
              {...register(`phNumbers.${index}.number` as const)}
            />
            {index > 0 && (
              <button type="button" onClick={() => remove(index)}>
                Remove
              </button>
            )}
          </div>
        );
      })}
      <div>
        <label>Age</label>
        <br />
        <input
          type="number"
          id="age"
          {...register("age", {
            valueAsNumber:true,
            required: {
              value: true,
              message: "age is required",
            },
          })}
         
        />
        <p className="error">{errors.age?.message}</p>
      </div>
      <div>
        <label>DOB</label>
        <br />
        <input
          type="date"
          id="date"
          {...register("DOB", {
            valueAsDate:true,
            required: {
              value: true,
              message: "dob is required",
            },
          })}
         
        />
        <p className="error">{errors.DOB?.message}</p>
      </div>
      

      <button type="button" onClick={() => append({ number: "" })}>
        Add Phone number
      </button>

      <button type="submit" disabled={!isValid || !isDirty || isSubmitting}>Submit</button>
      <br />

      <button type="button" onClick={() => reset()}>
        Reset
      </button>
      <button type="button" onClick={() => trigger("DOB")}>
        validate
      </button>
      <button type="button" onClick={handleGetValues}>Get values</button>
      <button type="button" onClick={handleSetValue}>Set Value</button>
    </form>
  );
};

export default Sample;
