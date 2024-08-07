using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SignalRDemo.Migrations
{
    /// <inheritdoc />
    public partial class long02 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_CTerms",
                table: "CTerms");

            migrationBuilder.RenameTable(
                name: "CTerms",
                newName: "Users");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Users",
                table: "Users",
                column: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Users",
                table: "Users");

            migrationBuilder.RenameTable(
                name: "Users",
                newName: "CTerms");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CTerms",
                table: "CTerms",
                column: "id");
        }
    }
}
