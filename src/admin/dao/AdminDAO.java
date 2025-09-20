package admin.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import admin.dto.AdvertisementDTO;
import config.DB;
import mypage.dto.InquiryDTO;
import store.dto.StoreDTO;

public class AdminDAO {
	Connection conn = null;
	PreparedStatement pstmt = null;
	ResultSet rs = null;
	
	public List<Integer> AllMember(List<String[]> listIn) {
		List<Integer> listOut = new ArrayList<>();
		try {
			conn = DB.dbConn();
			String sql = "";
			for (String[] entry : listIn) {
				String table = entry[0];
				String condition = entry[1];
				sql = "SELECT COUNT(*) AS result FROM " + table + " " + condition;
				pstmt = conn.prepareStatement(sql);
				rs = pstmt.executeQuery();
				if (rs.next()) {
					listOut.add(rs.getInt("result"));
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("Members_getSelectAll is failed");
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return listOut;
	}
	
	public List<Integer> AllStore(List<String> listIn) {
		List<Integer> listOut = new ArrayList<>();
		try {
			conn = DB.dbConn();
			String sql = "";
			for (int i = 0; i < listIn.size(); i++) {
				sql = listIn.get(i);
				pstmt = conn.prepareStatement(sql);
				rs = pstmt.executeQuery();
				if (rs.next()) {
					listOut.add(rs.getInt("result"));
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("Stores_getSelectAll is failed");
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return listOut;
	}
	
	public List<Integer> AllAds(List<String> listIn) {
		List<Integer> listOut = new ArrayList<>();
		try {
			conn = DB.dbConn();
			String sql = "";
			for (int i = 0; i < listIn.size(); i++) {
				sql = listIn.get(i);
				pstmt = conn.prepareStatement(sql);
				rs = pstmt.executeQuery();
				if (rs.next()) {
					listOut.add(rs.getInt("result"));
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("Ads_getSelectAll is failed");
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return listOut;
	}
	
	public List<AdvertisementDTO> RandomAds(int how) {
		List<AdvertisementDTO> listOut = new ArrayList<>();
		try {
			conn = DB.dbConn();
			String sql = "SELECT * FROM (SELECT * FROM ADVERTISEMENT WHERE AdStartDate <= SYSDATE AND AdEndDate >= SYSDATE ORDER BY DBMS_RANDOM.VALUE) WHERE ROWNUM <= ?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, how);
			rs = pstmt.executeQuery();
			
			while(rs.next()) {
				AdvertisementDTO dto = new AdvertisementDTO();
				dto.setAdNo(rs.getInt("AdNo"));
				dto.setAdTitle(rs.getString("AdTitle"));
				dto.setAdImage(rs.getString("AdImage"));
				dto.setAdRegidate(rs.getDate("AdRegidate"));
				dto.setAdStartDate(rs.getDate("AdStartDate"));
				dto.setAdEndDate(rs.getDate("AdEndDate"));
				dto.setDescription(rs.getString("Description"));
				
				listOut.add(dto);
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("Random_Ads Selecting is failed");
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return listOut;
	}
	
	public List<StoreDTO> StoreInfoWithOwnerName() {
		List<StoreDTO> listStore = new ArrayList<>();
		try {
			conn = DB.dbConn();
			String sql = "SELECT s.*, m.memberName AS OwnerName FROM MEMBER m JOIN STORE s ON s.MEMBERNO = m.MEMBERNO";
			sql += " ORDER BY STOREREGIDATE";
			pstmt = conn.prepareStatement(sql);
			rs = pstmt.executeQuery();

			while(rs.next()) {
				StoreDTO dto = new StoreDTO();
				dto.setStoreNo(rs.getInt("StoreNo"));
				dto.setMemberNo(rs.getInt("MemberNo"));
				dto.setStoreName(rs.getString("StoreName"));
				dto.setStoreCategory(rs.getString("StoreCategory"));
				dto.setOfficeName(rs.getString("OfficeName"));
				dto.setStoreContact(rs.getString("StoreContact"));
				dto.setStorePostalCode(rs.getString("StorePostalCode"));
				dto.setStoreAddr(rs.getString("StoreAddr"));
				dto.setStoreStreetAddr(rs.getString("StoreStreetAddr"));
				dto.setStoreAdditionalInfo(rs.getString("StoreAdditionalInfo"));
				dto.setStoreBusinessNum(rs.getString("StoreBusinessNum"));
				dto.setStoreImage(rs.getString("StoreImage"));
				dto.setStoreSchedule(rs.getString("StoreSchedule"));
				dto.setStoreComment(rs.getString("StoreComment"));
				dto.setStoreFacilities(rs.getString("StoreFacilities"));
				dto.setStoreRegidate(rs.getDate("StoreRegidate"));
				dto.setStoreUpdate(rs.getDate("StoreUpdate"));
				dto.setOwnerName(rs.getString("OwnerName"));
				
				listStore.add(dto);
			}
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("StoreInfoWithOwnerName is failed");
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return listStore;
	}
	
	// AdvertisementDAO
	public List<AdvertisementDTO> getSelectAll_Ad() {
		List<AdvertisementDTO> list = new ArrayList<>();
		try {
			conn = DB.dbConn();
			String sql = "SELECT AdNo, AdTitle, AdImage, AdRegidate, AdStartDate, AdEndDate, AdEndDate - AdRegidate AS remaining_days, description FROM Advertisement ORDER BY AdNo DESC";
			pstmt = conn.prepareStatement(sql);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				AdvertisementDTO dto = new AdvertisementDTO();
				dto.setAdNo(rs.getInt("AdNo"));
				dto.setAdTitle(rs.getString("AdTitle"));
				dto.setAdImage(rs.getString("AdImage"));
				dto.setAdRegidate(rs.getDate("AdRegidate"));
				dto.setAdStartDate(rs.getDate("AdStartDate"));
				dto.setAdEndDate(rs.getDate("AdEndDate"));
				dto.setRemaining_days(rs.getInt("remaining_days"));
				dto.setDescription(rs.getString("description"));
				
				list.add(dto);
			}
		} catch (Exception e) {
			System.out.println("Advertisement getSelectAll fail");
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return list;
	}
	
	public AdvertisementDTO getSelectOne_Ad(AdvertisementDTO dtoPm) {
		AdvertisementDTO dto = null;
		try {
			conn = DB.dbConn();
			String sql = "SELECT AdNo, AdTitle, AdImage, AdRegidate, AdStartDate, AdEndDate, AdEndDate - AdRegidate AS remaining_days, description FROM Advertisement WHERE AdNo = ? ORDER BY AdNo DESC";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getAdNo());
			rs = pstmt.executeQuery();
			if (rs.next()) {
				dto = new AdvertisementDTO();
				dto.setAdNo(rs.getInt("AdNo"));
				dto.setAdTitle(rs.getString("AdTitle"));
				dto.setAdImage(rs.getString("AdImage"));
				dto.setAdRegidate(rs.getDate("AdRegidate"));
				dto.setAdStartDate(rs.getDate("AdStartDate"));
				dto.setAdEndDate(rs.getDate("AdEndDate"));
				dto.setRemaining_days(rs.getInt("remaining_days"));
				dto.setDescription(rs.getString("description"));
			}
		} catch (Exception e) {
			System.out.println("Advertisement getSelectAll fail");
			e.printStackTrace();
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return dto;
	}
	
	public int setInsert(AdvertisementDTO dtoPm) {
		int result = 0;
		try {
			conn = DB.dbConn();
			String sql = "INSERT INTO Advertisement (AdNo, AdTitle, AdImage, AdRegidate, AdStartDate, AdEndDate, description) "
					+ "VALUES (SEQ_Advertisement.NEXTVAL, ?, ?, SYSDATE, ?, ? + ?, ?)";
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, dtoPm.getAdTitle());
			pstmt.setString(2, dtoPm.getAdImage());
			pstmt.setDate(3, dtoPm.getAdStartDate());
			pstmt.setDate(4, dtoPm.getAdStartDate());
			pstmt.setInt(5, dtoPm.getPeriod());
			pstmt.setString(6, dtoPm.getDescription());
			result = pstmt.executeUpdate();
		} catch (Exception e) {
			result = 0;
			System.out.println("Advertisement setInsert fail");
			e.printStackTrace();
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return result;
	}
	
	public int setUpdate(AdvertisementDTO dtoPm) {
		int result = 0;
		try {
			conn = DB.dbConn();
			String sql = "";
			
			if(dtoPm.getCheck_finish().equals("finish")) {
				sql = "UPDATE Advertisement SET AdTitle = ?, AdImage = ?, AdStartDate = ?, AdEndDate = ? + ?, description = ? WHERE adNo = ?";
				pstmt = conn.prepareStatement(sql);
				pstmt.setString(1, dtoPm.getAdTitle());
				pstmt.setString(2, dtoPm.getAdImage());
				pstmt.setDate(3, dtoPm.getAdStartDate());
				pstmt.setDate(4, dtoPm.getAdStartDate());
				pstmt.setInt(5, dtoPm.getPeriod());
				pstmt.setString(6, dtoPm.getDescription());
				pstmt.setInt(7, dtoPm.getAdNo());					
			} else {
				sql = "UPDATE Advertisement SET AdTitle = ?, AdImage = ?, AdStartDate = ?, AdEndDate = ? + ?, description = ? WHERE adNo = ?";
				pstmt = conn.prepareStatement(sql);
				pstmt.setString(1, dtoPm.getAdTitle());
				pstmt.setString(2, dtoPm.getAdImage());
				pstmt.setDate(3, dtoPm.getAdStartDate());
				pstmt.setDate(4, dtoPm.getAdEndDate());
				pstmt.setInt(5, dtoPm.getPeriod());
				pstmt.setString(6, dtoPm.getDescription());
				pstmt.setInt(7, dtoPm.getAdNo());
			}

			result = pstmt.executeUpdate();
			
		} catch (Exception e) {
			result = 0;
			System.out.println("Advertisement setUpdate fail");
			e.printStackTrace();
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return result;
	}
	
	public int setDelete(AdvertisementDTO dtoPm) {
		int result = 0;
		try {
			conn = DB.dbConn();
			String sql = "DELETE FROM Advertisement WHERE AdNo = ?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getAdNo());
			result = pstmt.executeUpdate();
		} catch (Exception e) {
			result = 0;
			System.out.println("Advertisement setDelete fail");
			e.printStackTrace();
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return result;
	}
	
	// InquiryList
	public List<InquiryDTO> getSelectAllInquiry() {
		List<InquiryDTO> list = new ArrayList<>();
		try {
			conn = DB.dbConn();
			String sql = "SELECT InquiryNo, InquiryType, InquiryContent, InquiryRegidate, InquiryCheck, MemberName "
					+ "FROM Inquiry I INNER JOIN MEMBER M ON I.MemberNo = M.MemberNo "
					+ "ORDER BY InquiryNo DESC";
			pstmt = conn.prepareStatement(sql);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				InquiryDTO dto = new InquiryDTO();
				dto.setInquiryNo(rs.getInt("InquiryNo"));
				dto.setInquiryType(rs.getString("InquiryType"));
				dto.setInquiryContent(rs.getString("InquiryContent"));
				dto.setInquiryRegidate(rs.getDate("InquiryRegidate"));
				dto.setInquiryCheck(rs.getString("InquiryCheck"));
				dto.setMemberName(rs.getString("MemberName"));
				list.add(dto);
			}
		} catch (Exception e) {
			System.out.println("getSelectAll is failed");
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return list;
	}
	
	public int setChecked(InquiryDTO dtoPm) {
		int result = 0;
		try {
			conn = DB.dbConn();
			String sql = "UPDATE Inquiry SET InquiryCheck = 'YES' WHERE InquiryNo = ?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getInquiryNo());
			result = pstmt.executeUpdate();
		} catch (Exception e) {
			result = 0;
			System.out.println("Inquiry setChecked fail");
			e.printStackTrace();
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return result;
	}
}
