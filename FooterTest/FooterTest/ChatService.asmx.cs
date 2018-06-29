using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Newtonsoft.Json;
using FooterTest.Models;
using System.Data.SqlClient;
using System.Configuration;
using System.Data;

namespace FooterTest
{
    /// <summary>
    /// Summary description for ChatService
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    // [System.Web.Script.Services.ScriptService]
    public class ChatService : System.Web.Services.WebService
    {

        public ChatModelContainer db = new ChatModelContainer();
        public ChatDbClass cdb = new ChatDbClass();

        [WebMethod]
        public string HelloWorld()
        {
            return "Hello World";
        }

        [WebMethod]
        public void addNewUser(string lname,string fname, string email, string mobile)
        {
            cdb.AddUser( lname,  fname,  email, mobile);
        }

        [WebMethod]
        public void CreateNewChat(string email,  Boolean isRead)
        {

            Console.WriteLine("client" + email);
            //get client id using clientEmail
            User clientUser = db.Users.Where(u => u.email == email).FirstOrDefault();

            db.Chats.Add(new Chat
            {
                remarks = clientUser.Id.ToString(),
                lastUpdate = DateTime.Now,
                isRead = isRead
            });
            db.SaveChanges();

           // cdb.createChat(email);
        }

        [WebMethod]
        public void sendMessage(string cEmail, string sEmail, string message)
        {
            cdb.newMessage(cEmail, sEmail, message);
        }

        [WebMethod]
        public void getMessage(string clientEmail)
        {
            var client = db.Users.Where(u => u.email == clientEmail).FirstOrDefault();
            var chat = db.Chats.Where(c => c.remarks == client.Id.ToString()).FirstOrDefault(); 
            var thread = db.Chatthreads.Where(t => t.ChatId == chat.Id).ToList();
            
            //create table
            DataTable Dt = new DataTable("MessageThread");
            Dt.Columns.Add("Id", typeof(int));
            Dt.Columns.Add("Chatid", typeof(int));
            Dt.Columns.Add("Userfname", typeof(string));
            Dt.Columns.Add("Userlname", typeof(string));
            Dt.Columns.Add("UserType", typeof(string));
            Dt.Columns.Add("Message", typeof(string));
            Dt.Columns.Add("DT", typeof(string));

            //get details for each message from the thread list
            foreach( var msg in thread)
            {
                //get users from the chat and its message from userid
                var user = db.Users.Where(u => u.Id == msg.UserId).FirstOrDefault();

                Dt.Rows.Add(msg.Id, msg.ChatId, user.fname, user.fname, user.usertype, msg.message, msg.datetime);

                Console.Write(msg.User);
            }


            DataSet ds = new DataSet();
            ds.Tables.Add(Dt);
            ds.DataSetName = "MessageThread";

            Context.Response.Clear();
            Context.Response.ContentType = "application/json";
            Context.Response.Write(JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented));
           
        }

        [WebMethod]
        public void getClientExist(string clientEmail)
        {
            var client = db.Users.Where(u => u.email == clientEmail).FirstOrDefault();
            var isExist = false;

            if (client == null)
            {
                isExist = false;
            }
            else{

                isExist = true;
            }


            //create table
            DataTable Dt = new DataTable("Result");
            Dt.Columns.Add("Exist", typeof(Boolean));
            
            Dt.Rows.Add(isExist);

            
            DataSet ds = new DataSet();
            ds.Tables.Add(Dt);
            ds.DataSetName = "Result";

            Context.Response.Clear();
            Context.Response.ContentType = "application/json";
            Context.Response.Write(JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented));


        }

        [WebMethod]
        public void getClientEmail(int userid)
        {
            var client = db.Users.Where(u => u.Id.Equals(userid)).FirstOrDefault();


            //create table
            DataTable Dt = new DataTable("Result");
            Dt.Columns.Add("Email", typeof(string));

            Dt.Rows.Add(client.email);


            DataSet ds = new DataSet();
            ds.Tables.Add(Dt);
            ds.DataSetName = "Result";

            Context.Response.Clear();
            Context.Response.ContentType = "application/json";
            Context.Response.Write(JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented));


        }

        [WebMethod]
        public void ReadChatAdmin(string clientEmail)
        {
            //update read Chat
            cdb.readChatAdmin(clientEmail);
        }

        [WebMethod]
        public void ReadChatClient(string clientEmail)
        {
            //update read Chat
            cdb.readChatClient(clientEmail);
        }

        [WebMethod]
        public void getUnreadMsg()
        {

            var Chat = db.Chats.Where(c => c.isRead.Equals(false)).ToList();
            
            //create table
            DataTable Dt = new DataTable("Result");
            Dt.Columns.Add("Count", typeof(int));

            Dt.Rows.Add(Chat.Count);
            
            DataSet ds = new DataSet();
            ds.Tables.Add(Dt);
            ds.DataSetName = "Result";

            Context.Response.Clear();
            Context.Response.ContentType = "application/json";
            Context.Response.Write(JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented));

        }
    }
}
