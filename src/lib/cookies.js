    export const setCookie = (name, value, options = {}) => {
    let cookieString = `${name}=${value}; path=${options.path || '/'}`;
  
    if (options.expires) {
      cookieString += `; expires=${options.expires.toUTCString()}`;
    }
  
    if (options.secure) {
      cookieString += '; Secure';
    }
  
    if (options.sameSite) {
      cookieString += `; SameSite=${options.sameSite}`;
    }

    
    if (typeof document !== 'undefined') {
      document.cookie = cookieString;
    }
    };
  
  export const getCookie = (name) => {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [key, value] = cookie.split('=');
        acc[key] = value;
        return acc;
      }, {});
      return cookies[name];
    }
  };
  
  export const deleteCookie = (name, options = {}) => {
    setCookie(name, '', { ...options, expires: new Date(0) });
  };
  