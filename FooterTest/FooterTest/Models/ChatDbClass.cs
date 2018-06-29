using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace FooterTest.Models
{
    public class ChatInfo
    {
        public int Id;
        public string user;
        public string remarks;
        public string message;
        public DateTime dtsent;
        public Boolean isRead;

    }

    public class ChatDbClass
    {

        public ChatModelContainer db = new ChatModelContainer();

        /**
         *  Add new client user to the database.
         *  parameters: lname, fname, email
         **/
        public void AddUser(string lname, string fname, string email, string mobile)
        {
            db.Users.Add(new Models.User
            {
                fname = fname,
                lname = lname,
                email = email,
                contactNo = mobile,
                usertype = "client"
            });

            db.SaveChanges();
        }

        public void createChat(string clientEmail)
        {
           
            Console.WriteLine("client" + clientEmail);
            //get client id using clientEmail
            User clientUser = db.Users.Where(u => u.email == clientEmail).FirstOrDefault();

            db.Chats.Add(new Chat {
                remarks = clientUser.Id.ToString()
            });
            db.SaveChanges();
        }

        public void newMessage(string clientEmail, string SenderEmail, string MessageString)
        {
            //get client id using clientEmail
            User clientUser = db.Users.Where(u => u.email.Equals(clientEmail)).FirstOrDefault();
            User senderUser = db.Users.Where(s => s.email.Equals(SenderEmail)).FirstOrDefault();
            Chat clientChat = db.Chats.Where(c => c.remarks.Equals(clientUser.Id.ToString())).FirstOrDefault();
           
            string dateNow = DateTime.Now.ToShortDateString() + " " + DateTime.Now.ToShortTimeString();
            db.Chatthreads.Add(new Chatthread {
                ChatId = clientChat.Id,
                UserId = senderUser.Id,
                message = MessageString,
                datetime = DateTime.Now.ToString()
            });

            db.SaveChanges();

        }
        
        public void readChatAdmin(string clientEmail)
        {
            var user = db.Users.Where( u => u.email.Equals(clientEmail)).FirstOrDefault();
            var chat = db.Chats.Where( c => c.remarks.Equals(user.Id.ToString())).FirstOrDefault();
            
            chat.isRead = true;

            //update
            db.Chats.Attach(chat);
            db.Entry(chat).Property(c => c.isRead).IsModified = true;
            db.SaveChanges();
        }

        public void readChatClient(string clientEmail)
        {
            var user = db.Users.Where(u => u.email.Equals(clientEmail)).FirstOrDefault();
            var chat = db.Chats.Where(c => c.remarks.Equals(user.Id.ToString())).FirstOrDefault();

            string dateNow = DateTime.Now.ToShortDateString() + " " + DateTime.Now.ToShortTimeString();
            //DateTime myDate = DateTime.ParseExact(dateNow, "yyyy-MM-dd HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture);

            chat.isRead = false;
            chat.lastUpdate = DateTime.Parse(dateNow);

            //update
            db.Chats.Attach(chat);
            db.Entry(chat).Property(c => c.isRead).IsModified = true;
            db.Entry(chat).Property(c => c.lastUpdate).IsModified = true;
            db.SaveChanges();
        }

    }
}