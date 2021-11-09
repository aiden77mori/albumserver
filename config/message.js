const message = (otp) =>{
     return `Dear User, \n\n` 
      + 'OTP for your phone verification is :\n\n'
      + `${otp}.\n\n`
      + ' This is a auto-generated email. Please do not reply to this email.\n\n'
      + ' Regards.\n'
      + ' Album App Center\n\n'
}

module.exports = message;