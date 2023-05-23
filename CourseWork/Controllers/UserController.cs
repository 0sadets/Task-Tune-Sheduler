using CourseWork.DataLayer;
using CourseWork.DTOModel;
using CourseWork.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
            return context.Notes.Select(n => new NoteDTO() { 
            Id = n.Id,
            Description = n.Description,
            Title = n.Title,
            DateCreation = n.DateCreation,
            EndDate = n.EndDate,
            Status = n.Status,
            User = context.Users.FirstOrDefault(u => u.Id == n.UserId).Email
            }).ToList();
        }
        
    }
}
