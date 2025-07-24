package mypage.dto;

import java.sql.Date;

public class InquiryDTO {
	private int InquiryNo;
	private int MemberNo;
	private String InquiryType;
	private String InquiryContent;
	private Date InquiryRegidate;
	private Date InquiryUpdate;
	private String InquiryCheck;
	private String MemberName;
	public int getInquiryNo() {
		return InquiryNo;
	}
	public void setInquiryNo(int inquiryNo) {
		InquiryNo = inquiryNo;
	}
	public int getMemberNo() {
		return MemberNo;
	}
	public void setMemberNo(int memberNo) {
		MemberNo = memberNo;
	}
	public String getInquiryType() {
		return InquiryType;
	}
	public void setInquiryType(String inquiryType) {
		InquiryType = inquiryType;
	}
	public String getInquiryContent() {
		return InquiryContent;
	}
	public void setInquiryContent(String inquiryContent) {
		InquiryContent = inquiryContent;
	}
	public Date getInquiryRegidate() {
		return InquiryRegidate;
	}
	public void setInquiryRegidate(Date inquiryRegidate) {
		InquiryRegidate = inquiryRegidate;
	}
	public Date getInquiryUpdate() {
		return InquiryUpdate;
	}
	public void setInquiryUpdate(Date inquiryUpdate) {
		InquiryUpdate = inquiryUpdate;
	}
	public String getInquiryCheck() {
		return InquiryCheck;
	}
	public void setInquiryCheck(String inquiryCheck) {
		InquiryCheck = inquiryCheck;
	}
	public String getMemberName() {
		return MemberName;
	}
	public void setMemberName(String memberName) {
		MemberName = memberName;
	}
}
