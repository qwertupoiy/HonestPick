package member.dto;

import java.sql.Date;

public class MemberDTO {
	private int MemberNo;
	private String MemberName;
	private String MemberId;
	private String MemberPwd;
	private String MemberChangePwd;
	private String PhoneNumber;
	private String MemberEmail;
	private String MemberImage;
	private String MemberNickname;
	private int Admin;
	private String MemberPostalCode;
	private String MemberAddr;
	private String MemberStreetAddr;
	private String MemberAdditionalInfo;
	private Date MemberRegidate;
	private Date MemberUpdate;
	private String Token;
	
	public String getMemberChangePwd() {
		return MemberChangePwd;
	}
	public void setMemberChangePwd(String memberChangePwd) {
		MemberChangePwd = memberChangePwd;
	}
	public int getMemberNo() {
		return MemberNo;
	}
	public void setMemberNo(int memberNo) {
		MemberNo = memberNo;
	}
	public String getMemberName() {
		return MemberName;
	}
	public void setMemberName(String memberName) {
		MemberName = memberName;
	}
	public String getMemberId() {
		return MemberId;
	}
	public void setMemberId(String memberId) {
		MemberId = memberId;
	}
	public String getMemberPwd() {
		return MemberPwd;
	}
	public void setMemberPwd(String memberPwd) {
		MemberPwd = memberPwd;
	}
	public String getPhoneNumber() {
		return PhoneNumber;
	}
	public void setPhoneNumber(String phoneNumber) {
		PhoneNumber = phoneNumber;
	}
	public String getMemberEmail() {
		return MemberEmail;
	}
	public void setMemberEmail(String memberEmail) {
		MemberEmail = memberEmail;
	}
	public String getMemberImage() {
		return MemberImage;
	}
	public void setMemberImage(String memberImage) {
		MemberImage = memberImage;
	}
	public String getMemberNickname() {
		return MemberNickname;
	}
	public void setMemberNickname(String memberNickname) {
		MemberNickname = memberNickname;
	}
	public int getAdmin() {
		return Admin;
	}
	public void setAdmin(int admin) {
		Admin = admin;
	}
	public String getMemberPostalCode() {
		return MemberPostalCode;
	}
	public void setMemberPostalCode(String memberPostalCode) {
		MemberPostalCode = memberPostalCode;
	}
	public String getMemberAddr() {
		return MemberAddr;
	}
	public void setMemberAddr(String memberAddr) {
		MemberAddr = memberAddr;
	}
	public String getMemberStreetAddr() {
		return MemberStreetAddr;
	}
	public void setMemberStreetAddr(String memberStreetAddr) {
		MemberStreetAddr = memberStreetAddr;
	}
	public String getMemberAdditionalInfo() {
		return MemberAdditionalInfo;
	}
	public void setMemberAdditionalInfo(String memberAdditionalInfo) {
		MemberAdditionalInfo = memberAdditionalInfo;
	}
	public Date getMemberRegidate() {
		return MemberRegidate;
	}
	public void setMemberRegidate(Date memberRegidate) {
		MemberRegidate = memberRegidate;
	}
	public Date getMemberUpdate() {
		return MemberUpdate;
	}
	public void setMemberUpdate(Date memberUpdate) {
		MemberUpdate = memberUpdate;
	}
	public String getToken() {
		return Token;
	}
	public void setToken(String token) {
		Token = token;
	}
}