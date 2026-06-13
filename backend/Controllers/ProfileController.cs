using backend.Data;
using backend.Dtos;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;

        public ProfileController(
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var user = await _userManager.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound(new { message = "User not found." });

            var roles = await _userManager.GetRolesAsync(user);

            var doctorProfile = await _context.Doctors
                .FirstOrDefaultAsync(d => d.ApplicationUserId == user.Id);

            return Ok(new
            {
                user.Id,
                user.FullName,
                user.Email,
                Role = roles.FirstOrDefault() ?? "No Role",
                Clinic = "OptiVision Eye Clinic",
                DoctorProfile = doctorProfile
            });
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateProfile(ProfileUpdateDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var user = await _userManager.FindByIdAsync(userId!);

            if (user == null)
                return NotFound(new { message = "User not found." });

            user.FullName = dto.FullName;

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { message = "Profile updated successfully." });
        }

        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var user = await _userManager.FindByIdAsync(userId!);

            if (user == null)
                return NotFound(new { message = "User not found." });

            var result = await _userManager.ChangePasswordAsync(
                user,
                dto.CurrentPassword,
                dto.NewPassword
            );

            if (!result.Succeeded)
                return BadRequest(new
                {
                    message = "Failed to change password.",
                    errors = result.Errors.Select(e => e.Description)
                });

            return Ok(new { message = "Password changed successfully." });
        }
    }
}