using api_soil_brief.Data;
using api_soil_brief.Entity;
using api_soil_brief.Helpers;
using Microsoft.EntityFrameworkCore;

namespace api_soil_brief.Services
{
    public class UsuarioService
    {
        private readonly DataBaseConfig _context;
        private readonly JwtHelper _jwt;

        public UsuarioService(DataBaseConfig context, JwtHelper jwt)
        {
            _context = context;
            _jwt = jwt;
        }

        public async Task<Usuario> Update(Usuario usuario)
        {
            var existingUsuario = await GetById(usuario.Id);
            if (existingUsuario != null)
            {
                /*existingUsuario.Nome = usuario.Nome;
                existingUsuario.Email = usuario.Email;
                existingUsuario.SenhaHash = usuario.SenhaHash;
                await _context.SaveChangesAsync();*/
            }

            return usuario;
        }

        public Usuario Create(Usuario usuario)
        {
            _context.Usuarios.Add(usuario);
            _context.SaveChanges();
            return usuario;
        }

        public async Task<Usuario> GetById(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null) throw new Exception("Usuário não encontrado!");
            return usuario;
        }

        public async Task<object> Login(string email, string senha)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == email);
            
            if (usuario == null || !BCrypt.Net.BCrypt.Verify(senha, usuario.SenhaHash)) throw new Exception("Email ou Senha inválidos!");

            var token = _jwt.GenerateJwtToken(usuario.Id, usuario.Email);

            return new { token };
        }
    }
}
