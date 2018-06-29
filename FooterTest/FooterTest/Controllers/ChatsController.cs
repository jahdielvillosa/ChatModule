using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using FooterTest.Models;

namespace FooterTest.Controllers
{
    public class ChatsController : Controller
    {
        private ChatModelContainer db = new ChatModelContainer();
        private ChatDbClass cdb = new ChatDbClass();

        // GET: Chats
        public ActionResult Index()
        {
            IEnumerable<Chat> chat = db.Chats.ToList();
            List<ChatInfo> cinfo = new List<ChatInfo>();
            
            foreach (var item in chat)
            {
                //get message from chatthread
                var itemid = int.Parse(item.remarks);
                var cthread = db.Chatthreads.Where(ct => ct.ChatId.Equals(item.Id)).OrderByDescending(p => p.Id).FirstOrDefault();
                var User = db.Users.Where(u => u.Id.Equals(itemid)).FirstOrDefault();
                if (cthread == null)
                {

                    cinfo.Add(new ChatInfo
                    {
                        Id = item.Id,
                        user = User.fname + " " + User.lname,
                        remarks = item.remarks,
                        message = "none",
                        dtsent = item.lastUpdate,
                        isRead = item.isRead

                    });
                }
                else
                {

                    cinfo.Add(new ChatInfo
                    {
                        Id = item.Id,
                        user = User.lname + ", " + User.fname,
                        remarks = item.remarks,
                        message = cthread.message,
                        dtsent = item.lastUpdate,
                        isRead = item.isRead

                    });
                }
            }

            return View(cinfo.OrderByDescending(c => c.dtsent).ToList());
        }

        // GET: Chats/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Chat chat = db.Chats.Find(id);
            if (chat == null)
            {
                return HttpNotFound();
            }
            return View(chat);
        }

        // GET: Chats/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Chats/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,remarks,lastUpdate,isRead")] Chat chat)
        {
            if (ModelState.IsValid)
            {
                db.Chats.Add(chat);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(chat);
        }

        // GET: Chats/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Chat chat = db.Chats.Find(id);
            if (chat == null)
            {
                return HttpNotFound();
            }
            return View(chat);
        }

        // POST: Chats/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,remarks,lastUpdate,isRead")] Chat chat)
        {
            if (ModelState.IsValid)
            {
                db.Entry(chat).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(chat);
        }

        // GET: Chats/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Chat chat = db.Chats.Find(id);
            if (chat == null)
            {
                return HttpNotFound();
            }
            return View(chat);
        }

        // POST: Chats/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Chat chat = db.Chats.Find(id);
            db.Chats.Remove(chat);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
