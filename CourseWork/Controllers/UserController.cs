using CourseWork.DataLayer;
using CourseWork.DTOModel;
using CourseWork.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CourseWork.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DataContext context;
        public UserController(DataContext dataContext)
        {
            this.context = dataContext;
        }
        [HttpGet("get-notes")]
        public List<NoteDTO> GetNotes()
        {
            return context.Notes.Select(n => new NoteDTO()
            {
                Id = n.Id,
                Description = n.Description,
                Title = n.Title,
                DateCreation = n.DateCreation,
                EndDate = n.EndDate,
                Status = n.Status,
                User = context.Users.FirstOrDefault(u => u.Id == n.UserId).Email
            }).ToList();
        }
        [HttpPost("add-note")]
        public ActionResult AddNotes([FromForm] string EvName, [FromForm] string EvDesc, [FromForm] string currentDate, [FromForm] string currentUser)
        {
            var newNote = new Note()
            {
                Title = EvName,
                DateCreation = DateTime.Parse(currentDate),
                EndDate = DateTime.Parse(currentDate),
                Description = EvDesc,
                UserId = context.Users.FirstOrDefault(u => u.Email == currentUser).Id
            };
            context.Notes.Add(newNote);
            context.SaveChanges();
            return Redirect("http://127.0.0.1:5500/pages/calendar.html");
            
            //    return null;
        }
        [HttpPost("set-status")]
        public void SetStatus([FromQuery] string id)
        {
            var note = context.Notes.FirstOrDefault(n => n.Id == Int32.Parse(id));
            note.Status = true;
            context.SaveChanges();
        }

        [HttpGet("get-no-date-note")]
        public List<NoteDTO> GetList()
        {
            return context.Notes.Where(x => x.EndDate == null && x.DateCreation == null).Select(n => new NoteDTO()
            {
                Id = n.Id,
                Title = n.Title,
                Status = n.Status,
                User = context.Users.FirstOrDefault(u => u.Id == n.UserId).Email
            }).ToList();
        }
        [HttpPost("add-no-date-note")]

        public void AddNoDateNote([FromQuery] string title, string user)
        {
            var newnote = new Note()
            {
                Title = title,
                UserId = context.Users.FirstOrDefault(u => u.Email == user).Id,
                Status = false,
                Description = ""
            };
            context.Notes.Add(newnote);
            context.SaveChanges();
        }



    }
}
