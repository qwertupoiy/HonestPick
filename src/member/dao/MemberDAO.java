package member.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.List;
import java.util.ArrayList;

import config.DB;
import member.dto.MemberDTO;

public class MemberDAO {
	Connection conn = null;
	PreparedStatement pstmt = null;
	ResultSet rs = null;
	
	// login
	public MemberDTO getLogin(MemberDTO dtoPm) {
		MemberDTO dto  = new MemberDTO();
		try {
			conn = DB.dbConn();
			String sql = "SELECT MemberNo, MemberPwd, MemberNickname, Admin FROM MEMBER WHERE MemberId = ?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, dtoPm.getMemberId());
			rs = pstmt.executeQuery();
			if (rs.next()) {
				dto.setMemberNo(rs.getInt("MemberNo"));
				dto.setMemberPwd(rs.getString("MemberPwd"));
				dto.setMemberNickname(rs.getString("MemberNickname"));
				dto.setAdmin(rs.getInt("Admin"));
			}
		} catch (Exception e) {
			System.out.println("getLogin fail");
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return dto;
	}
	
	public int saveAutoLoginToken(MemberDTO dtoPm) {
		int result = 0;
		try {
			conn = DB.dbConn();
			String sql = "MERGE INTO AutoLogin USING dual ON (MemberNo = ?) " +
                    "WHEN MATCHED THEN UPDATE SET Token = ?, ExpireDate = SYSDATE + 7 " +
                    "WHEN NOT MATCHED THEN INSERT (MemberNo, Token, ExpireDate) VALUES (?, ?, SYSDATE + 7)";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getMemberNo());
            pstmt.setString(2, dtoPm.getToken());
            pstmt.setInt(3, dtoPm.getMemberNo());
            pstmt.setString(4, dtoPm.getToken());
			result = pstmt.executeUpdate();
		} catch (Exception e) {
			result = 0;
			e.printStackTrace();
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return result;
	}
	
	public MemberDTO getMemberByToken(String token) {
	    MemberDTO dto = null;
	    try {
	        conn = DB.dbConn();
	        String sql = "SELECT m.MemberNo, m.MemberNickname, m.Admin " +
	                     "FROM Member m " +
	                     "JOIN AutoLogin a ON m.MemberNo = a.MemberNo " +
	                     "WHERE a.Token = ? AND a.ExpireDate > SYSDATE";
	        pstmt = conn.prepareStatement(sql);
	        pstmt.setString(1, token);
	        rs = pstmt.executeQuery();
	        if (rs.next()) {
	            dto = new MemberDTO();
	            dto.setMemberNo(rs.getInt("MemberNo"));
	            dto.setMemberNickname(rs.getString("MemberNickname"));
	            dto.setAdmin(rs.getInt("Admin"));
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	    } finally {
	        DB.dbConnClose(rs, pstmt, conn);
	    }
	    return dto;
	}
	
	public void removeAutoLoginToken(int memberNo) {
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    try {
	    	conn = DB.dbConn();
	        String sql = "DELETE FROM AutoLogin WHERE MemberNo = ?";
	        pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, memberNo);
	        pstmt.executeUpdate();
	    } catch (Exception e) {
	        e.printStackTrace();
	    } finally {
	    	DB.dbConnClose(rs, pstmt, conn);
	    }
	}
	
	// join Id_check
	public boolean isMemberIdExists(String memberId) {
	    try {
			conn = DB.dbConn();
			String sql = "SELECT COUNT(*) FROM member WHERE memberId = ?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, memberId);
			rs = pstmt.executeQuery();
			if (rs.next()) {
				return rs.getInt(1) > 0;
			}
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("IdCheck fail");
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
	    return false;
	}
	
	// join Nick_check
	public boolean isMemberNickExists(String memberNickname) {
	    try {
			conn = DB.dbConn();
			String sql = "SELECT COUNT(*) FROM member WHERE memberNickname = ?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, memberNickname);
			rs = pstmt.executeQuery();
			if (rs.next()) {
				return rs.getInt(1) > 0;
			}
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("NickCheck fail");
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
	    return false;
	}
	
	// Member
	public List<MemberDTO> getSelectAll() {
		List<MemberDTO> list = new ArrayList<>();
		try {
			conn = DB.dbConn();
			// --------------------------------------------
			String sql = "SELECT MemberNo, MemberImage, MemberName, MemberID, MemberPwd, PhoneNumber, MemberEmail, MemberNickname, Admin, ";
			sql += "MemberPostalCode, MemberAddr, MemberStreetAddr, MemberAdditionalInfo, MemberRegidate FROM Member";
			pstmt = conn.prepareStatement(sql);
			rs = pstmt.executeQuery();
			while(rs.next()) {
				MemberDTO dto = new MemberDTO();
				
				dto.setMemberNo(rs.getInt("MemberNo"));
				dto.setMemberImage(rs.getString("MemberImage"));
				dto.setMemberName(rs.getString("MemberName"));
				dto.setMemberId(rs.getString("MemberID"));
				dto.setPhoneNumber(rs.getString("PhoneNumber"));
				dto.setMemberEmail(rs.getString("MemberEmail"));
				dto.setMemberNickname(rs.getString("MemberNickname"));
				dto.setAdmin(rs.getInt("Admin"));
				dto.setMemberPostalCode(rs.getString("MemberPostalCode"));
				dto.setMemberAddr(rs.getString("MemberAddr"));
				dto.setMemberStreetAddr(rs.getString("MemberStreetAddr"));
				dto.setMemberAdditionalInfo(rs.getString("MemberAdditionalInfo"));
				dto.setMemberRegidate(rs.getDate("MemberRegidate"));
								
				list.add(dto);
			}
			// --------------------------------------------
		} catch(Exception e) {
			e.printStackTrace();
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return list;
	}
	
	public MemberDTO getSelectOne(MemberDTO dtoPm) {
		MemberDTO dto  = new MemberDTO();
		try {
			conn = DB.dbConn();
			// --------------------------------------------
			String sql = "SELECT MemberImage, MemberName, MemberID, MemberPwd, PhoneNumber, MemberEmail, MemberNickname, Admin, ";
			sql += "MemberPostalCode, MemberAddr, MemberStreetAddr, MemberAdditionalInfo, MemberRegidate FROM Member WHERE MemberNo = ?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getMemberNo());
			rs = pstmt.executeQuery();
			if (rs.next()) {
				dto.setMemberNo(dtoPm.getMemberNo());
				dto.setMemberImage(rs.getString("MemberImage"));
				dto.setMemberName(rs.getString("MemberName"));
				dto.setMemberId(rs.getString("MemberID"));
				dto.setPhoneNumber(rs.getString("PhoneNumber"));
				dto.setMemberEmail(rs.getString("MemberEmail"));
				dto.setMemberNickname(rs.getString("MemberNickname"));
				dto.setAdmin(rs.getInt("Admin"));
				dto.setMemberPostalCode(rs.getString("MemberPostalCode"));
				dto.setMemberAddr(rs.getString("MemberAddr"));
				dto.setMemberStreetAddr(rs.getString("MemberStreetAddr"));
				dto.setMemberAdditionalInfo(rs.getString("MemberAdditionalInfo"));
				dto.setMemberRegidate(rs.getDate("MemberRegidate"));
			}
		} catch (Exception e) {
			System.out.println("Member SelectOne fail");
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return dto;
	}
	
	public int setInsert(MemberDTO dtoPm) {
		int result = 0;
		try {
			conn = DB.dbConn();
			String sql = "INSERT INTO MEMBER (MemberNo, MemberName, MemberId, MemberPwd, "
					+ "PhoneNumber, MemberEmail, MemberImage, MemberNickname, Admin, "
					+ "MemberPostalCode, MemberAddr, MemberStreetAddr, MemberAdditionalInfo, "
					+ "MemberRegidate, MemberUpdate) "
					+ "VALUES (SEQ_MEMBERNO.NEXTVAL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, SYSDATE, SYSDATE)";
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, dtoPm.getMemberName());
			pstmt.setString(2, dtoPm.getMemberId());
			pstmt.setString(3, dtoPm.getMemberPwd());
			pstmt.setString(4, dtoPm.getPhoneNumber());
			pstmt.setString(5, dtoPm.getMemberEmail());
			pstmt.setString(6, dtoPm.getMemberImage());
			pstmt.setString(7, dtoPm.getMemberNickname());
			pstmt.setInt(8, dtoPm.getAdmin());
			pstmt.setString(9, dtoPm.getMemberPostalCode());
			pstmt.setString(10, dtoPm.getMemberAddr());
			pstmt.setString(11, dtoPm.getMemberStreetAddr());
			pstmt.setString(12, dtoPm.getMemberAdditionalInfo());
			result = pstmt.executeUpdate();
		} catch (Exception e) {
			result = 0;
			e.printStackTrace();
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return result;
	}
	
	public int setUpdate(MemberDTO dtoPm) {
		int result = 0;
		try {
			conn = DB.dbConn();
			String sql = "UPDATE MEMBER SET MemberNickname = ?, PhoneNumber = ?, MemberEmail = ?, "
					+ "MemberPostalCode = ?, MemberAddr = ?, MemberStreetAddr = ?, MemberAdditionalInfo = ?, "
					+ "MemberImage = ?, MemberUpdate = SYSDATE where MemberNo = ?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, dtoPm.getMemberNickname());
			pstmt.setString(2, dtoPm.getPhoneNumber());
			pstmt.setString(3, dtoPm.getMemberEmail());
			pstmt.setString(4, dtoPm.getMemberPostalCode());
			pstmt.setString(5, dtoPm.getMemberAddr());
			pstmt.setString(6, dtoPm.getMemberStreetAddr());
			pstmt.setString(7, dtoPm.getMemberAdditionalInfo());
			pstmt.setString(8, dtoPm.getMemberImage());
			pstmt.setInt(9, dtoPm.getMemberNo());

			result = pstmt.executeUpdate();
		} catch (Exception e) {
			e.printStackTrace();
			result = 0;
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return result;
	}
	
	public int setDelete(MemberDTO dtoPm) {
		int result = 0;
		try {
			conn = DB.dbConn();
			String sql = "DELETE FROM MEMBER WHERE MemberNo = ?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getMemberNo());
			result = pstmt.executeUpdate();
		} catch (Exception e) {
			result = 0;
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return result;
	}
}