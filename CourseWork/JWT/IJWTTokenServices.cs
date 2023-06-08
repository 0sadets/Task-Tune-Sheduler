using CourseWork.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace CourseWork.JWT
{
    public interface IJWTTokenServices
    {
        string CreateToken(User user);
    }
}
