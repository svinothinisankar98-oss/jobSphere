export type LoginForm = {
  email: string;
  password: string;
};

export type LoginProps = {
  onClose?: () => void;
};