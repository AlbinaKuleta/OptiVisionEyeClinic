using backend.Constants;
using backend.Data;
using backend.Dtos;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = UserRoles.Admin)]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _context;

        public UsersController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userManager.Users
                .OrderBy(u => u.FullName)
                .ToListAsync();

            var result = new List<object>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);

                result.Add(new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    Roles = roles
                });
            }

            return Ok(result);
        }

        [HttpGet("doctors")]
        public async Task<IActionResult> GetDoctorUsers()
        {
            var users = await _userManager.GetUsersInRoleAsync(UserRoles.Doctor);

            var result = users
                .OrderBy(u => u.FullName)
                .Select(user => new
                {
                    user.Id,
                    user.FullName,
                    user.Email
                });

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser(CreateUserDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.FullName))
                return BadRequest(new { message = "Full name is required." });

            if (string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest(new { message = "Email is required." });

            if (string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest(new { message = "Password is required." });

            if (string.IsNullOrWhiteSpace(dto.Role))
                return BadRequest(new { message = "Role is required." });

            if (!await _roleManager.RoleExistsAsync(dto.Role))
                return BadRequest(new { message = "Invalid role." });

            var existingUser = await _userManager.FindByEmailAsync(dto.Email);

            if (existingUser != null)
                return BadRequest(new { message = "User with this email already exists." });

            if (dto.Role == UserRoles.Doctor && string.IsNullOrWhiteSpace(dto.Specialization))
                return BadRequest(new { message = "Specialization is required for doctor users." });

            var user = new ApplicationUser
            {
                FullName = dto.FullName.Trim(),
                UserName = dto.Email.Trim(),
                Email = dto.Email.Trim(),
                EmailConfirmed = true
            };

            var createResult = await _userManager.CreateAsync(user, dto.Password);

            if (!createResult.Succeeded)
            {
                return BadRequest(new
                {
                    message = "Failed to create user.",
                    errors = createResult.Errors.Select(e => e.Description)
                });
            }

            var roleResult = await _userManager.AddToRoleAsync(user, dto.Role);

            if (!roleResult.Succeeded)
            {
                await _userManager.DeleteAsync(user);

                return BadRequest(new
                {
                    message = "Failed to assign role.",
                    errors = roleResult.Errors.Select(e => e.Description)
                });
            }

            if (dto.Role == UserRoles.Doctor)
            {
                var doctorExists = await _context.Doctors
                    .AnyAsync(d => d.ApplicationUserId == user.Id);

                if (!doctorExists)
                {
                    var doctor = new Doctor
                    {
                        ApplicationUserId = user.Id,
                        Specialization = dto.Specialization?.Trim() ?? string.Empty,
                        PhoneNumber = dto.PhoneNumber?.Trim() ?? string.Empty,
                        Availability = dto.Availability?.Trim() ?? string.Empty,
                        Notes = dto.Notes?.Trim() ?? string.Empty
                    };

                    _context.Doctors.Add(doctor);
                    await _context.SaveChangesAsync();
                }
            }

            return Ok(new
            {
                message = "User created successfully.",
                user = new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    Role = dto.Role
                }
            });
        }

        [HttpPut("{id}/role")]
        public async Task<IActionResult> UpdateUserRole(string id, UpdateUserRoleDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Role))
                return BadRequest(new { message = "Role is required." });

            if (!await _roleManager.RoleExistsAsync(dto.Role))
                return BadRequest(new { message = "Invalid role." });

            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
                return NotFound(new { message = "User not found." });

            var currentRoles = await _userManager.GetRolesAsync(user);

            var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);

            if (!removeResult.Succeeded)
            {
                return BadRequest(new
                {
                    message = "Failed to remove current role.",
                    errors = removeResult.Errors.Select(e => e.Description)
                });
            }

            var addResult = await _userManager.AddToRoleAsync(user, dto.Role);

            if (!addResult.Succeeded)
            {
                return BadRequest(new
                {
                    message = "Failed to assign new role.",
                    errors = addResult.Errors.Select(e => e.Description)
                });
            }

            var doctorProfile = await _context.Doctors
                .FirstOrDefaultAsync(d => d.ApplicationUserId == user.Id);

            if (dto.Role == UserRoles.Doctor && doctorProfile == null)
            {
                _context.Doctors.Add(new Doctor
                {
                    ApplicationUserId = user.Id,
                    Specialization = "General Ophthalmology",
                    PhoneNumber = string.Empty,
                    Availability = string.Empty,
                    Notes = string.Empty
                });
            }

            if (dto.Role != UserRoles.Doctor && doctorProfile != null)
            {
                _context.Doctors.Remove(doctorProfile);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "User role updated successfully." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
                return NotFound(new { message = "User not found." });

            var doctorProfile = await _context.Doctors
                .FirstOrDefaultAsync(d => d.ApplicationUserId == user.Id);

            if (doctorProfile != null)
            {
                _context.Doctors.Remove(doctorProfile);
                await _context.SaveChangesAsync();
            }

            var result = await _userManager.DeleteAsync(user);

            if (!result.Succeeded)
            {
                return BadRequest(new
                {
                    message = "Failed to delete user.",
                    errors = result.Errors.Select(e => e.Description)
                });
            }

            return Ok(new { message = "User deleted successfully." });
        }
    }
}