//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace FooterTest.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Chatthread
    {
        public int Id { get; set; }
        public string message { get; set; }
        public string datetime { get; set; }
        public int ChatId { get; set; }
        public int UserId { get; set; }
    
        public virtual Chat Chat { get; set; }
        public virtual User User { get; set; }
    }
}