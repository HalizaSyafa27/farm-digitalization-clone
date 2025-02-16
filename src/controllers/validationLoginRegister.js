export const validateEmail = (input) => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    if (isEmail) return { valid: true, type: "email" };
    return { valid: false, type: null };
  };

  export const validatePassword = (password, rePassword) => {
    if (!password) {
      return { valid: false, message: "Password tidak boleh kosong." };
    }
    if (password !== rePassword) {
      return { valid: false, message: "Password dan konfirmasi password tidak cocok." };
    }
    return { valid: true, message: "" };
  };