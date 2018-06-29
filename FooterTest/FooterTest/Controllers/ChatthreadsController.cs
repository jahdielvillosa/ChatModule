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
    public class ChatthreadsController : Controller
    {
        private ChatModelContainer db = new ChatModelContainer();

        // GET: Chatthreads
        public ActionResult Index()
        {
            var chatthreads = db.Chatthreads.Include(c => c.Chat).Include(c => c.User);
            return View(chatthreads.ToList());
        }

        // GET: Chatthreads/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Chatthread chatthread = db.Chatthreads.Find(id);
            if (chatthread == null)
            {
                return HttpNotFound();
            }
            return View(chatthread);
        }

        // GET: Chatthreads/Create
        public ActionResult Create()
        {
            ViewBag.ChatId = new SelectList(db.Chats, "Id", "remarks");
            ViewBag.UserId = new SelectList(db.Users, "Id", "fname");
            return View();
        }

        // POST: Chatthreads/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,message,datetime,ChatId,UserId")] Chatthread chatthread)
        {
            if (ModelState.IsValid)
            {
                db.Chatthreads.Add(chatthread);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.ChatId = new SelectList(db.Chats, "Id", "remarks", chatthread.ChatId);
            ViewBag.UserId = new SelectList(db.Users, "Id", "fname", chatthread.UserId);
            return View(chatthread);
        }

        // GET: Chatthreads/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Chatthread chatthread = db.Chatthreads.Find(id);
            if (chatthread == null)
            {
                return HttpNotFound();
            }
            ViewBag.ChatId = new SelectList(db.Chats, "Id", "remarks", chatthread.ChatId);
            ViewBag.UserId = new SelectList(db.Users, "Id", "fname", chatthread.UserId);
            return View(chatthread);
        }

        // POST: Chatthreads/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,message,datetime,ChatId,UserId")] Chatthread chatthread)
        {
            if (ModelState.IsValid)
            {
                db.Entry(chatthread).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.ChatId = new SelectList(db.Chats, "Id", "remarks", chatthread.ChatId);
            ViewBag.UserId = new SelectList(db.Users, "Id", "fname", chatthread.UserId);
            return View(chatthread);
        }

        // GET: Chatthreads/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Chatthread chatthread = db.Chatthreads.Find(id);
            if (chatthread == null)
            {
                return HttpNotFound();
            }
            return View(chatthread);
        }

        // POST: Chatthreads/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Chatthread chatthread = db.Chatthreads.Find(id);
            db.Chatthreads.Remove(chatthread);
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
