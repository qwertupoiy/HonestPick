CREATE TABLE MEMBER (
MemberNo                NUMBER          PRIMARY KEY,
MemberName              VARCHAR2(50)    NOT NULL,
MemberId                VARCHAR2(50)    UNIQUE NOT NULL,
MemberPwd               VARCHAR2(50)    NOT NULL,
PhoneNumber             VARCHAR2(30)    NOT NULL,
MemberEmail             VARCHAR2(50)    NOT NULL,
MemberImage             VARCHAR2(50)    DEFAULT '-',
MemberNickname          VARCHAR2(50)    NOT NULL,
Admin                   NUMBER          DEFAULT 0  NOT NULL,
MemberPostalCode        VARCHAR2(50)    NOT NULL,
MemberAddr              VARCHAR2(50)    NOT NULL,
MemberStreetAddr        VARCHAR2(50)    NOT NULL,
MemberAdditionalInfo    VARCHAR2(50),
MemberRegidate          DATE DEFAULT SYSDATE NOT NULL,
MemberUpdate            DATE DEFAULT SYSDATE NOT NULL
);

CREATE SEQUENCE SEQ_StoreNo START WITH 10056;

--------------------------------------------------

CREATE TABLE STORE (
StoreNo             NUMBER          PRIMARY KEY,
MemberNo            NUMBER          NOT NULL,
StoreCategory       VARCHAR2(50)    NOT NULL,
StoreName           VARCHAR2(50)    NOT NULL,
OfficeName          VARCHAR2(50)    NOT NULL,
StoreContact        VARCHAR2(50)    NOT NULL,
StorePostalCode     VARCHAR2(50)    NOT NULL,
StoreAddr           VARCHAR2(50)    NOT NULL,
StoreStreetAddr     VARCHAR2(50)    NOT NULL,
StoreAdditionalInfo VARCHAR2(50)    ,
StoreBusinessNum    VARCHAR2(50)    NOT NULL,
StoreImage          VARCHAR2(50)    DEFAULT '-',
StoreSchedule       VARCHAR2(1000)  NOT NULL,
StoreComment        VARCHAR2(1000)  ,
StoreFacilities     VARCHAR2(100)   ,
StoreRegidate       DATE DEFAULT SYSDATE NOT NULL,
StoreUpdate         DATE DEFAULT SYSDATE NOT NULL,
MemberShip          DATE DEFAULT SYSDATE NOT NULL
);

CREATE SEQUENCE SEQ_StoreNo START WITH 1051;

--------------------------------------------------

CREATE TABLE Reservation (
  ResNo           NUMBER          PRIMARY KEY,
  MemberNo        NUMBER          NOT NULL REFERENCES Member(MemberNo),
  StoreNo         NUMBER          NOT NULL REFERENCES Store(StoreNo),
  ResComment      VARCHAR2(50)    ,
  ResDate         VARCHAR2(50)    NOT NULL,
  ResTime         VARCHAR2(50)    NOT NULL,
  ResPeople       VARCHAR2(50)    NOT NULL,
  ResRegidate     DATE DEFAULT SYSDATE NOT NULL,
  ResUpdate       DATE DEFAULT SYSDATE NOT NULL,
  ChangeReason    VARCHAR2(500)
);

CREATE SEQUENCE SEQ_ResNo START WITH 630;

--------------------------------------------------

CREATE TABLE Menu (
  MenuNo              NUMBER          PRIMARY KEY,
  MenuName            VARCHAR2(50)    NOT NULL,
  MenuPrice           VARCHAR2(50)    NOT NULL,
  MenuImage           VARCHAR2(50)    DEFAULT '-',
  MenuDescription     VARCHAR2(1000)  NOT NULL,
  MenuRegidate        DATE DEFAULT SYSDATE NOT NULL,
  MenuUpdate          DATE DEFAULT SYSDATE NOT NULL,
  StoreNo             NUMBER          NOT NULL REFERENCES Store(StoreNo) ON DELETE CASCADE
);

CREATE SEQUENCE SEQ_MenuNO START WITH 65;

--------------------------------------------------

CREATE TABLE Review (
  ReviewNo                NUMBER          PRIMARY KEY,
  ReviewTitle             VARCHAR2(50)    NOT NULL,
  ReviewContent           VARCHAR2(1000)  NOT NULL,
  ReviewEstimation        NUMBER          NOT NULL,
  ReviewRecommendation    NUMBER          DEFAULT 0,
  ReviewImage             VARCHAR2(50)    DEFAULT '-',
  ReviewRegidate          DATE DEFAULT SYSDATE NOT NULL,
  ReviewUpdate            DATE DEFAULT SYSDATE NOT NULL,
  StoreNo                 NUMBER          NOT NULL REFERENCES Store(StoreNo),
  MemberNo                NUMBER          NOT NULL REFERENCES Member(MemberNo),
  ResNo                   NUMBER          DEFAULT 0 NOT NULL
);

CREATE SEQUENCE SEQ_ReviewNo START WITH 100200;

--------------------------------------------------

CREATE TABLE WishList (
WishNo      NUMBER  PRIMARY KEY,
MemberNo    NUMBER  NOT NULL,
StoreNo     NUMBER  NOT NULL
);

CREATE SEQUENCE SEQ_WishNo START WITH 559;

----------------------------------------------------------------------------------------------------

CREATE TABLE Advertisement (
AdNo        NUMBER        PRIMARY KEY,
AdTitle     VARCHAR2(50)  NOT NULL,
AdImage     VARCHAR2(500)  NOT NULL,
AdRegidate  Date   DEFAULT SYSDATE NOT NULL,
AdStartDate Date   DEFAULT SYSDATE NOT NULL,
AdEndDate   Date   DEFAULT SYSDATE NOT NULL,
description VARCHAR2(1000)
);

CREATE SEQUENCE SEQ_Advertisement START WITH 5001;

----------------------------------------------------------------------------------------------------

CREATE TABLE AutoLogin (
    MemberNo INT PRIMARY KEY,
    Token VARCHAR2(255),
    ExpireDate DATE
);

SELECT * FROM AutoLogin;

----------------------------------------------------------------------------------------------------

CREATE TABLE Inquiry (
    InquiryNo INT PRIMARY KEY,
    MemberNo INT,
    InquiryType VARCHAR2(50) NOT NULL,
    InquiryContent VARCHAR2(100) NOT NULL,
    InquiryRegidate DATE DEFAULT SYSDATE,
    InquiryUpdate DATE DEFAULT SYSDATE,
    InquiryCheck VARCHAR2(10) DEFAULT 'NO'
);

CREATE SEQUENCE SEQ_InquiryNo START WITH 22;

----------------------------------------------------------------------------------------------------
