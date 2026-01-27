export const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^.{6,}$/,
  phone: /^[6-9]\d{9}$/,
  interphone:/^(\+91[6-9]\d{9}|[6-9]\d{9}|\+[1-9]\d{7,14})$/,
  name: /^[a-zA-Z ]+$/,
   url:/^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/
};