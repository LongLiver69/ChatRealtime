using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SignalRDemo.Domain.Entities;
using SignalRDemo.Domain.Models;
using System;

namespace SignalRDemo.HubConfig
{
    public class MyHub : Hub
    {
        private readonly DatabaseContext _context;

        public MyHub(DatabaseContext context)
        {
            _context = context;
        }

        public async Task authMe(Account account)
        {
            string currSignalrID = Context.ConnectionId;
            var tempUser = await _context.Users.Where(p => p.Username == account.Username && p.Password == account.Password).SingleOrDefaultAsync();

            if (tempUser != null)
            {
                Console.WriteLine("\n" + tempUser.Name + " logged in" + "\nSignalrID: " + currSignalrID);

                var currconnect = new Connection
                {
                    UserId = tempUser.Id,
                    SignalrId = currSignalrID,
                    Timestamp = DateTime.Now
                };
                await _context.Connections.AddAsync(currconnect);
                await _context.SaveChangesAsync();

                var res = new UserDto()
                {
                    UserId = tempUser.Id,
                    FullName = tempUser.Name,
                    SignalrId = currSignalrID
                };

                await Clients.Caller.SendAsync("authMeResponseSuccess", res);
                await Clients.Others.SendAsync("userOn", res);
            }
            else
            {
                await Clients.Caller.SendAsync("authMeResponseFail");
            }
        }

        public async Task reauthMe(int userId)
        {
            string currSignalrID = Context.ConnectionId;
            var tempUser = await _context.Users.Where(p => p.Id == userId).SingleOrDefaultAsync();

            if (tempUser != null)
            {
                var newConn = new Connection()
                {
                    UserId = tempUser.Id,
                    SignalrId = currSignalrID,
                    Timestamp = DateTime.Now
                };

                await _context.Connections.AddAsync(newConn);
                await _context.SaveChangesAsync();

                var res = new UserDto()
                {
                    UserId = tempUser.Id,
                    FullName = tempUser.Name,
                    SignalrId = currSignalrID
                };

                await Clients.Caller.SendAsync("reauthMeResponse", res);
                await Clients.Others.SendAsync("userOn", res);                
            }
            else
            {
                Console.WriteLine("Error");
            }
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            int currUserId = _context.Connections.Where(c => c.SignalrId == Context.ConnectionId).Select(c => c.UserId).SingleOrDefault();
            _context.Connections.RemoveRange(_context.Connections.Where(p => p.UserId == currUserId).ToList());
            _context.SaveChanges();
            Clients.Others.SendAsync("userOff", currUserId);

            return base.OnDisconnectedAsync(exception);
        }

        public void LogOut(int personId)
        {
            _context.Connections.RemoveRange(_context.Connections.Where(p => p.UserId == personId).ToList());
            _context.SaveChanges();
            Clients.Caller.SendAsync("logoutResponse");
            Clients.Others.SendAsync("userOff", personId);
        }

        public async Task GetOnlineUsers()
        {
            int currUserId = _context.Connections.Where(c => c.SignalrId == Context.ConnectionId).Select(c => c.UserId).SingleOrDefault();
            var onlineUsers = _context.Connections
                .Where(c => c.UserId != currUserId)
                .Select(c =>
                    new UserDto() 
                    { 
                        UserId = c.UserId, 
                        FullName = _context.Users.Where(p => p.Id == c.UserId).Select(p => p.Name).SingleOrDefault(),
                        SignalrId = c.SignalrId
                    }
                ).ToList();
            await Clients.Caller.SendAsync("getOnlineUsersResponse", onlineUsers);
        }

        public async Task SendMsg(Message msgInfo)
        {
            await Clients.Client(msgInfo.ToConnectionId).SendAsync("sendMsgResponse", msgInfo);
        }
    }
}
