
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, 2012 and Azure
-- --------------------------------------------------
-- Date Created: 06/23/2018 15:07:13
-- Generated from EDMX file: C:\Users\Villosa\documents\visual studio 2015\Projects\FooterTest\FooterTest\Models\ChatModel.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [chatdb];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[FK_ChatChatthread]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Chatthreads] DROP CONSTRAINT [FK_ChatChatthread];
GO
IF OBJECT_ID(N'[dbo].[FK_UserChatthread]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Chatthreads] DROP CONSTRAINT [FK_UserChatthread];
GO

-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[Chats1]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Chats1];
GO
IF OBJECT_ID(N'[dbo].[Chatthreads]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Chatthreads];
GO
IF OBJECT_ID(N'[dbo].[Users]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Users];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'Users'
CREATE TABLE [dbo].[Users] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [fname] nvarchar(max)  NOT NULL,
    [lname] nvarchar(max)  NOT NULL,
    [email] nvarchar(max)  NOT NULL,
    [usertype] nvarchar(max)  NOT NULL,
    [contactNo] nvarchar(max)  NOT NULL
);
GO

-- Creating table 'Chats'
CREATE TABLE [dbo].[Chats] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [remarks] nvarchar(max)  NOT NULL,
    [lastUpdate] datetime  NOT NULL,
    [isRead] bit  NOT NULL
);
GO

-- Creating table 'Chatthreads'
CREATE TABLE [dbo].[Chatthreads] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [message] nvarchar(max)  NOT NULL,
    [datetime] nvarchar(max)  NOT NULL,
    [ChatId] int  NOT NULL,
    [UserId] int  NOT NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [Id] in table 'Users'
ALTER TABLE [dbo].[Users]
ADD CONSTRAINT [PK_Users]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Chats'
ALTER TABLE [dbo].[Chats]
ADD CONSTRAINT [PK_Chats]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Chatthreads'
ALTER TABLE [dbo].[Chatthreads]
ADD CONSTRAINT [PK_Chatthreads]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- Creating foreign key on [ChatId] in table 'Chatthreads'
ALTER TABLE [dbo].[Chatthreads]
ADD CONSTRAINT [FK_ChatChatthread]
    FOREIGN KEY ([ChatId])
    REFERENCES [dbo].[Chats]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_ChatChatthread'
CREATE INDEX [IX_FK_ChatChatthread]
ON [dbo].[Chatthreads]
    ([ChatId]);
GO

-- Creating foreign key on [UserId] in table 'Chatthreads'
ALTER TABLE [dbo].[Chatthreads]
ADD CONSTRAINT [FK_UserChatthread]
    FOREIGN KEY ([UserId])
    REFERENCES [dbo].[Users]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_UserChatthread'
CREATE INDEX [IX_FK_UserChatthread]
ON [dbo].[Chatthreads]
    ([UserId]);
GO

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------