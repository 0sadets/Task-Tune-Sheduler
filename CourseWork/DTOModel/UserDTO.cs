using CourseWork.ViewModels;
using System;
using System.Collections.Generic;

namespace CourseWork.DTOModel
{
    public class UserDTO
    {
        public UserDTO()
        {
            Notes = new List<NoteDTO>();
        }
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public DateTime Birthday { get; set; }
        public ICollection<NoteDTO> Notes { get; set; }
        public string Email { get; set; }
        


    }
}
