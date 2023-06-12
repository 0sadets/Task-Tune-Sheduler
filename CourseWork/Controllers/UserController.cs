using CourseWork.DataLayer;
using CourseWork.DTOModel;
using CourseWork.JWT;
using CourseWork.Results;
using CourseWork.Validator;
using CourseWork.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace CourseWork.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DataContext context;
        private readonly UserManager<User> userManager;
        private readonly SignInManager<User> signInManager;
        private readonly IJWTTokenServices jwtTokenService;

        public UserController(DataContext dataContext, UserManager<User> _userManager, SignInManager<User> _signInManager, IJWTTokenServices _jwtTokenService)
        {
            this.context = dataContext;
            this.userManager = _userManager;
            this.signInManager = _signInManager;
            this.jwtTokenService = _jwtTokenService;
        }
        [HttpGet("get-notes-by-email")]
        public List<NoteDTO> GetNotesByEmail([FromQuery] string email)
        {
            var user = context.Users.FirstOrDefault(x => x.Email == email);
            return context.Notes.Where(x => x.UserId == user.Id).Select(n => new NoteDTO()
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
        public List<NoteDTO> GetList([FromQuery] string email)
        {
            var user = context.Users.FirstOrDefault(x => x.Email == email);
            return context.Notes.Where(x => x.EndDate == null && x.DateCreation == null && x.UserId == user.Id).Select(n => new NoteDTO()
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
        [HttpPost("delete-all-no-date")]
        public void DeleteAllNoDateNotes()
        {
            context.Notes.RemoveRange(context.Notes.Where(x => x.EndDate == null && x.DateCreation == null));
            context.SaveChanges();
        }
        [HttpPost("edit-no-date-note")]
        public void EditNoDateNote([FromQuery] string id, string title)
        {
            var note = context.Notes.FirstOrDefault(x => x.Id == Int32.Parse(id));
            note.Title = title;
            context.Notes.Update(note);
            context.SaveChanges();
        }
        [HttpPost("delete-no-date-note-by-id")]
        public void DeleteNoDateNote([FromQuery] string id)
        {
            var note = context.Notes.FirstOrDefault(x => x.Id == Int32.Parse(id));
            context.Notes.Remove(note);
            context.SaveChanges();
        }

        [HttpPost("register")]
        public async Task<ResultDTO> Register([FromQuery] string userName, string lastName, string firstName, string middleName, string password, string email, string birthday)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new ResultErrorDTO()
                    {
                        Status = 401,
                        Message = "ERROR",
                        Errors = CustomValidator.getErrorsByModel(ModelState)
                    };
                }

                var user = new User()
                {
                    UserName = userName,
                    Email = email,
                    Birthday = DateTime.Parse(birthday),
                    FirstName = firstName,
                    MiddleName = middleName,
                    LastName = lastName
                };


                IdentityResult result = await userManager.CreateAsync(user, password);
                result = await userManager.AddToRoleAsync(user, "user");

                if (result.Succeeded)
                {
                    context.Users.Attach(user);
                    context.SaveChanges();

                    return new ResultDTO()
                {
                    Message = "OK",
                    Status = 200
                };
                }
                else
                {
                    return new ResultErrorDTO()
                    {
                        Message = "ERROR",
                        Status = 403,
                        Errors = CustomValidator.getErrorsByIdentityResult(result)
                    };
                }


            }
            catch (Exception e)
            {
                return new ResultErrorDTO
                {
                    Status = 500,
                    Message = e.Message,
                    Errors = new List<string>()
                    {
                        e.Message
                    }
                };
            }

        }
        [HttpGet("get-user-by-email")]
        public UserDTO GetUserByEmail ([FromQuery] string email)
        {
            var user = context.Users.FirstOrDefault(x => x.Email == email);
            return new UserDTO()
            {
                Id = user.Id,
                FirstName = user.FirstName,
                MiddleName = user.MiddleName,
                LastName = user.LastName,
                Email = email,
                UserName = user.UserName,
                Birthday = user.Birthday
            };
        }
        [HttpPost("login")]
        public async Task<ResultDTO> Login([FromQuery] string email, string password)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new ResultErrorDTO
                    {
                        Message = "ERROR",
                        Status = 401,
                        Errors = CustomValidator.getErrorsByModel(ModelState)
                    };
                }

                var result = signInManager.PasswordSignInAsync(email, password, false, false).Result;

                if (!result.Succeeded)
                {
                    return new ResultErrorDTO
                    {
                        Status = 403,
                        Message = "ERROR",
                        Errors = new List<string> { "Incorrect email or password" }
                    };
                }
                else
                {
                    var user = await userManager.FindByEmailAsync(email);
                    await signInManager.SignInAsync(user, false);


                    return new ResultLoginDTO
                    {
                        Status = 200,
                        Message = "OK",
                        Token = jwtTokenService.CreateToken(user)
                    };
                }
            }
            catch (Exception e)
            {
                return new ResultErrorDTO
                {
                    Status = 500,
                    Message = "ERROR",
                    Errors = new List<string> { e.Message }
                };
            }
        }

    }





}
