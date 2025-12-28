const AUTH_KEY = "authUser";

export const authStorage = {
  set(user: any) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));          //user login save user details browser memory//
    window.dispatchEvent(new Event("auth-change"));
  },

  get() {
    const data = localStorage.getItem(AUTH_KEY);                  //reads user fron storage text to object  no user null//
    return data ? JSON.parse(data) : null;
  },

  remove() {
    localStorage.removeItem(AUTH_KEY);                              //user logout remove user from storage then event trigger//
    window.dispatchEvent(new Event("auth-change"));
  },
};
