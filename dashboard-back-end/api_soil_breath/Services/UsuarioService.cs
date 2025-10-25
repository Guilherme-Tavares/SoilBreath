using api_soil_breath.Data;
using api_soil_breath.Entity;
using Microsoft.EntityFrameworkCore;

namespace api_soil_breath.Services
{
    public class UsuarioService
    {
        private readonly DataBaseConfig _context;

        public UsuarioService(DataBaseConfig context)
        {
            _context = context;
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

        public async Task<Usuario> Login(string email, string senha)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == email);

            if (usuario == null) throw new Exception("Usuário não encontrado!");

            bool senhaCorreta = BCrypt.Net.BCrypt.Verify(senha, usuario.SenhaHash);

            if (!senhaCorreta) throw new Exception("Senha incorreta!");

            usuario.SenhaHash = null;

            return usuario;
        }
    }
}
