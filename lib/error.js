exports.ERRORS = {
    'not_logged_in' : { 
      error: 'not_logged_in',
      message: "You must be logged in to perform this. Either login or register using the above links."
    },
    'not_authorized' : {
      error: 'not_authorized',
      message: "You are not authorized to perform this action."
    },
    'invalid_route' : {
      error: 'invalid_route',
      message: "The page you have requested does not exist."
    },
    'login_failed' : {
      error: 'login_failed',
      message: "The account information provided does not match our records. Please check the email and password."
    },
    'already_logged_in' : {
      error: 'already_logged_in',
      message: "You're already logged in so whatever you're trying to do makes no sense!"
    },
    'reg_fields_empty' : {
      error: 'reg_fields_empty',
      message: "You must fill out all required fields. Please try again."
    },
    'reg_user_exists' : {
      error: 'reg_user_exists',
      message: "This email is already registered. If it belongs to you, try logging in."
    }
  };