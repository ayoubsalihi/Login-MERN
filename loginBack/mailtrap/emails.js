import { mailtrapClient, sender } from "./mailtrap.config.js"
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js"
export const sendVerificationEmail = async (email,verificationToken) =>{
    const recipient = [{email}]
    try {
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"verify email",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken)
            ,category:"Email verification"
        })
        console.log("Welcome email sent successfully", response); 
    } catch (error) {
        throw new Error(`Error sending verification email: ${error}`);
        
    }
}

export const sendWelcomeEmail = async (email,name)=>{
  const recipient = [{email}]

  try {
    const response = await mailtrapClient.send({
      from:sender,
      to:recipient,
      template_uuid:"327d5ea6-edf8-4a3b-ae93-2c4ece87e2fd",
      template_variables:{
        "company_info_name": "Products company",
        "name": name,
      },
    })
    console.log(`welcome ${response}`);
    
  } catch (error) {
    console.error(`Error sending welcome email`, error);

		throw new Error(`Error sending welcome email: ${error}`); 
  }
}