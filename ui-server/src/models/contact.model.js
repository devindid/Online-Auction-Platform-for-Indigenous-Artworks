import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: {type: String, default: "",  },
  email: {type: String, default: "",  },
  message: {type: String, default: "",  },
}, 
{
  timestamps: true,
});

const Contact = mongoose.model("Contact", contactSchema);


export default Contact;
