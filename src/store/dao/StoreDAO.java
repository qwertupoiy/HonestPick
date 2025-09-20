package store.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import config.DB;
import store.dto.MenuDTO;
import store.dto.ReservationDTO;
import store.dto.ReviewDTO;
import store.dto.StoreDTO;

public class StoreDAO {
	Connection conn = null;
	PreparedStatement pstmt = null;
	ResultSet rs = null;
	
	// MemberShip
	   public List<StoreDTO> getSelectMembership() {
	       List<StoreDTO> list = new ArrayList<>();
	       try {
	           conn = DB.dbConn();
	           String sql = "SELECT S.*, "
	                   + "(SELECT MAX(TO_NUMBER(MenuPrice)) FROM Menu M WHERE S.StoreNo = M.StoreNo) AS MenuMax, "
	                   + "(SELECT MIN(TO_NUMBER(MenuPrice)) FROM Menu M WHERE S.StoreNo = M.StoreNo) AS MenuMin, "
	                   + "(SELECT COUNT(*) FROM Review R WHERE S.StoreNo = R.StoreNo) AS ReviewCount, "
	                   + "(SELECT AVG(ReviewEstimation) FROM Review R WHERE S.StoreNo = R.StoreNo) AS ReviewEstimation "
	                   + "FROM ( "
	                   + "    SELECT * FROM Store "
	                   + "    WHERE MemberShip > SYSDATE "
	                   + "    ORDER BY DBMS_RANDOM.VALUE "
	                   + ") S "
	                   + "WHERE ROWNUM <= 3";
	           pstmt = conn.prepareStatement(sql);
	           rs = pstmt.executeQuery();
	           while (rs.next()) {
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

	               MenuDTO dtoMenu = new MenuDTO();
	               dtoMenu.setMenuMax(rs.getString("MenuMax"));
	               dtoMenu.setMenuMin(rs.getString("MenuMin"));

	               ReviewDTO dtoReview = new ReviewDTO();
	               dtoReview.setReviewCount(rs.getInt("ReviewCount"));
	               dtoReview.setReviewEstimation(rs.getFloat("ReviewEstimation"));

	               dto.setMenu(dtoMenu);
	               dto.setReview(dtoReview);
	               list.add(dto);
	           }
	       } catch (Exception e) {
	           System.out.println("Store getSelectMembershipTop3 fail");
	           e.printStackTrace();
	       } finally {
	           DB.dbConnClose(rs, pstmt, conn);
	       }
	       return list;
	   }
	   
	   // Store
	   public List<StoreDTO> getSelectAll(List<StoreDTO> listStore) {
	      try {
	         conn = DB.dbConn();
	         String sql = "SELECT S.*, "
	               + "(SELECT MAX(TO_NUMBER(MenuPrice)) FROM Menu M WHERE S.StoreNo = M.StoreNo) AS MenuMax, "
	               + "(SELECT MIN(TO_NUMBER(MenuPrice)) FROM Menu M WHERE S.StoreNo = M.StoreNo) AS MenuMin, "
	               + "(SELECT COUNT(*) FROM Review R WHERE S.StoreNo = R.StoreNo) AS ReviewCount, "
	               + "(SELECT AVG(ReviewEstimation) FROM Review R WHERE S.StoreNo = R.StoreNo) AS ReviewEstimation "
	               + "FROM Store S ORDER BY StoreNo DESC";
	         pstmt = conn.prepareStatement(sql);
	         rs = pstmt.executeQuery();
	         while (rs.next()) {
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
	            
	            MenuDTO dtoMenu = new MenuDTO();
	            dtoMenu.setMenuMax(rs.getString("MenuMax"));
	            dtoMenu.setMenuMin(rs.getString("MenuMin"));
	            
	            ReviewDTO dtoReview = new ReviewDTO();
	            dtoReview.setReviewCount(rs.getInt("ReviewCount"));
	            dtoReview.setReviewEstimation(rs.getFloat("ReviewEstimation"));
	            
	            dto.setMenu(dtoMenu);
	            dto.setReview(dtoReview);
	            listStore.add(dto);
	         }
	      } catch (Exception e) {
	         System.out.println("Store getSelectAll fail");
	      } finally {
	         DB.dbConnClose(rs, pstmt, conn);
	      }
	      return listStore;
	   }
	
	public List<StoreDTO> getSelectSearch(StoreDTO dtoPm) {
		List<StoreDTO> list = new ArrayList<>();
		try {
			conn = DB.dbConn();
			String sql = "SELECT S.*, "
					+ "(SELECT MAX(TO_NUMBER(MenuPrice)) FROM Menu M WHERE S.StoreNo = M.StoreNo) AS MenuMax, "
					+ "(SELECT MIN(TO_NUMBER(MenuPrice)) FROM Menu M WHERE S.StoreNo = M.StoreNo) AS MenuMin, "
					+ "(SELECT COUNT(*) FROM Review R WHERE S.StoreNo = R.StoreNo) AS ReviewCount, "
					+ "(SELECT AVG(ReviewEstimation) FROM Review R WHERE S.StoreNo = R.StoreNo) AS ReviewEstimation "
					+ "FROM Store S WHERE StoreName LIKE ? ORDER BY StoreNo DESC";
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, "%" + dtoPm.getStoreName() + "%");
			rs = pstmt.executeQuery();
			while (rs.next()) {
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
				
				MenuDTO dtoMenu = new MenuDTO();
				dtoMenu.setMenuMax(rs.getString("MenuMax"));
				dtoMenu.setMenuMin(rs.getString("MenuMin"));
				
				ReviewDTO dtoReview = new ReviewDTO();
				dtoReview.setReviewCount(rs.getInt("ReviewCount"));
				dtoReview.setReviewEstimation(rs.getFloat("ReviewEstimation"));
				
				dto.setMenu(dtoMenu);
				dto.setReview(dtoReview);
				list.add(dto);
			}
		} catch (Exception e) {
			System.out.println("Store getSelectAll fail");
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return list;
	}
	
	public StoreDTO getSelectOne(StoreDTO dtoPm) {
		StoreDTO dto  = new StoreDTO();
		try {
			conn = DB.dbConn();
			String sql = "SELECT MemberNo, StoreCategory, StoreName, OfficeName, StoreContact, "
					+ "StorePostalCode, StoreAddr, StoreStreetAddr, StoreAdditionalInfo, "
					+ "StoreBusinessNum, StoreImage, StoreSchedule, StoreComment, "
					+ "StoreFacilities, StoreRegidate, StoreUpdate, "
					+ "(SELECT MAX(TO_NUMBER(MenuPrice)) FROM Menu M WHERE S.StoreNo = M.StoreNo) AS MenuMax, "
					+ "(SELECT MIN(TO_NUMBER(MenuPrice)) FROM Menu M WHERE S.StoreNo = M.StoreNo) AS MenuMin "
					+ "FROM STORE S WHERE S.StoreNo = ?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getStoreNo());
			rs = pstmt.executeQuery();
			if (rs.next()) {
				dto.setStoreNo(dtoPm.getStoreNo());
				dto.setMemberNo(rs.getInt("MemberNo"));
				dto.setStoreCategory(rs.getString("StoreCategory"));
				dto.setStoreName(rs.getString("StoreName"));
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
				
				MenuDTO dtoMenu = new MenuDTO();
				dtoMenu.setMenuMax(rs.getString("MenuMax"));
				dtoMenu.setMenuMin(rs.getString("MenuMin"));
				
				dto.setMenu(dtoMenu);
			}
		} catch (Exception e) {
			System.out.println("Store getSelectOne fail");
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return dto;
	}
	
	public int setInsert(StoreDTO dtoPm) {
		int result = 0;
		try {
			conn = DB.dbConn();
			String sql = "INSERT INTO STORE (StoreNo, MemberNo, StoreCategory, StoreName, OfficeName, StoreContact, "
					+ "StorePostalCode, StoreAddr, StoreStreetAddr, StoreAdditionalInfo, "
					+ "StoreBusinessNum, StoreImage, StoreSchedule, StoreComment, StoreFacilities, "
					+ "StoreRegidate, StoreUpdate) "
					+ "VALUES (SEQ_STORENO.NEXTVAL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, SYSDATE, SYSDATE)";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getMemberNo());
			pstmt.setString(2, dtoPm.getStoreCategory());
			pstmt.setString(3, dtoPm.getStoreName());
			pstmt.setString(4, dtoPm.getOfficeName());
			pstmt.setString(5, dtoPm.getStoreContact());
			pstmt.setString(6, dtoPm.getStorePostalCode());
			pstmt.setString(7, dtoPm.getStoreAddr());
			pstmt.setString(8, dtoPm.getStoreStreetAddr());
			pstmt.setString(9, dtoPm.getStoreAdditionalInfo());
			pstmt.setString(10, dtoPm.getStoreBusinessNum());
			pstmt.setString(11, dtoPm.getStoreImage());
			pstmt.setString(12, dtoPm.getStoreSchedule());
			pstmt.setString(13, dtoPm.getStoreComment());
			pstmt.setString(14, dtoPm.getStoreFacilities());
			result = pstmt.executeUpdate();
		} catch (Exception e) {
			result = 0;
			e.printStackTrace();
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return result;
	}
	
	public int setUpdate(StoreDTO dtoPm) {
		int result = 0;
		try {
			conn = DB.dbConn();
			String sql = "UPDATE STORE SET StoreCategory = ?, StoreName = ?, OfficeName = ?, StoreContact = ?, "
					+ "StorePostalCode = ?, StoreAddr = ?, StoreStreetAddr = ?, StoreAdditionalInfo = ?, "
					+ "StoreBusinessNum = ?, StoreImage = ?, StoreSchedule = ?, StoreComment = ?, "
					+ "StoreFacilities = ?, StoreUpdate = SYSDATE WHERE StoreNo = ?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, dtoPm.getStoreCategory());
			pstmt.setString(2, dtoPm.getStoreName());
			pstmt.setString(3, dtoPm.getOfficeName());
			pstmt.setString(4, dtoPm.getStoreContact());
			pstmt.setString(5, dtoPm.getStorePostalCode());
			pstmt.setString(6, dtoPm.getStoreAddr());
			pstmt.setString(7, dtoPm.getStoreStreetAddr());
			pstmt.setString(8, dtoPm.getStoreAdditionalInfo());
			pstmt.setString(9, dtoPm.getStoreBusinessNum());
			pstmt.setString(10, dtoPm.getStoreImage());
			pstmt.setString(11, dtoPm.getStoreSchedule());
			pstmt.setString(12, dtoPm.getStoreComment());
			pstmt.setString(13, dtoPm.getStoreFacilities());
			pstmt.setInt(14, dtoPm.getStoreNo());
			result = pstmt.executeUpdate();
		} catch (Exception e) {
			result = 0;
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return result;
	}
	
	public int setDelete(StoreDTO dtoPm) {
		int result = 0;
		try {
			conn = DB.dbConn();
			String sql = "DELETE FROM STORE WHERE StoreNo = ?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getStoreNo());
			result = pstmt.executeUpdate();
		} catch (Exception e) {
			result = 0;
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return result;
	}
	
	// Menu
	public List<MenuDTO> getSelectAllMenu(StoreDTO dtoPm) {
		List<MenuDTO> list = new ArrayList<>();
		try {
			conn = DB.dbConn();
			String sql = "SELECT MenuNo, MenuName, MenuImage, MenuPrice, MenuDescription "
					+ "FROM MENU WHERE StoreNo = ? ORDER BY MenuNo DESC";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getStoreNo());
			rs = pstmt.executeQuery();
			while (rs.next()) {
				MenuDTO dto = new MenuDTO();
				dto.setStoreNo(dtoPm.getStoreNo());
				dto.setMenuNo(rs.getInt("MenuNo"));
				dto.setMenuName(rs.getString("MenuName"));
				dto.setMenuPrice(rs.getString("MenuPrice"));
				dto.setMenuImage(rs.getString("MenuImage"));
				dto.setMenuDescription(rs.getString("MenuDescription"));
				list.add(dto);
			}
		} catch (Exception e) {
			System.out.println("Memu getSelectMenu fail");
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return list;
	}
	
	public MenuDTO getSelectOne(MenuDTO dtoPm) {
		MenuDTO dto  = new MenuDTO();
		try {
			conn = DB.dbConn();
			String sql = "SELECT MenuName, MenuPrice, MenuImage, MenuDescription "
					+ "FROM MENU WHERE StoreNo = ? AND MenuNo = ?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getStoreNo());
			pstmt.setInt(2, dtoPm.getMenuNo());
			rs = pstmt.executeQuery();
			if (rs.next()) {
				dto.setStoreNo(dtoPm.getStoreNo());
				dto.setMenuNo(dtoPm.getMenuNo());
				dto.setMenuName(rs.getString("MenuName"));
				dto.setMenuPrice(rs.getString("MenuPrice"));
				dto.setMenuImage(rs.getString("MenuImage"));
				dto.setMenuDescription(rs.getString("MenuDescription"));
			}
		} catch (Exception e) {
			System.out.println("Menu getSelectMenu fail");
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return dto;
	}
	
	public int setInsert(MenuDTO dtoPm) {
		int result = 0;
		try {
			conn = DB.dbConn();
			String sql = "INSERT INTO MENU (MenuNo, StoreNo, MenuName, MenuPrice, "
					+ "MenuImage, MenuDescription, MenuRegidate, MenuUpdate) "
					+ "VALUES (SEQ_MENUNO.NEXTVAL, ?, ?, ?, ?, ?, SYSDATE, SYSDATE)";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getStoreNo());
			pstmt.setString(2, dtoPm.getMenuName());
			pstmt.setString(3, dtoPm.getMenuPrice());
			pstmt.setString(4, dtoPm.getMenuImage());
			pstmt.setString(5, dtoPm.getMenuDescription());
			result = pstmt.executeUpdate();
		} catch (Exception e) {
			result = 0;
			e.printStackTrace();
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return result;
	}
	
	public int setUpdate(MenuDTO dtoPm) {
		int result = 0;
		try {
			conn = DB.dbConn();
			String sql = "UPDATE MENU SET MenuName = ?, MenuPrice = ?, MenuImage = ?, "
					+ "MenuDescription = ?, MenuUpdate = SYSDATE "
					+ "WHERE StoreNo = ? AND MenuNo = ?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, dtoPm.getMenuName());
			pstmt.setString(2, dtoPm.getMenuPrice());
			pstmt.setString(3, dtoPm.getMenuImage());
			pstmt.setString(4, dtoPm.getMenuDescription());
			pstmt.setInt(5, dtoPm.getStoreNo());
			pstmt.setInt(6, dtoPm.getMenuNo());
			result = pstmt.executeUpdate();
		} catch (Exception e) {
			result = 0;
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return result;
	}
	
	public int setDelete(MenuDTO dtoPm) {
		int result = 0;
		try {
			conn = DB.dbConn();
			String sql = "DELETE FROM MENU WHERE StoreNo = ? AND MenuNo = ?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getStoreNo());
			pstmt.setInt(2, dtoPm.getMenuNo());
			result = pstmt.executeUpdate();
		} catch (Exception e) {
			result = 0;
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return result;
	}
	
	// Reservation
	public List<ReservationDTO> getSelectAllRes() {
		List<ReservationDTO> list = new ArrayList<>();
		try {
			conn = DB.dbConn();
			String sql = "SELECT ResNo, MemberNo, StoreNo, ResComment, ResDate, ResTime, "
					+ "ResPeople, ResRegidate, ResUpdate FROM Reservation ORDER BY ResDate DESC";
			pstmt = conn.prepareStatement(sql);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				ReservationDTO dto = new ReservationDTO();
				dto.setResNo(rs.getInt("ResNo"));
				dto.setMemberNo(rs.getInt("MemberNo"));
				dto.setStoreNo(rs.getInt("StoreNo"));
				dto.setResComment(rs.getString("ResComment"));
				dto.setResDate(rs.getString("ResDate"));
				dto.setResTime(rs.getString("ResTime"));
				dto.setResPeople(rs.getString("ResPeople"));
				dto.setResRegidate(rs.getDate("ResRegidate"));
				dto.setResUpdate(rs.getDate("ResUpdate"));
				list.add(dto);
			}
		} catch (Exception e) {
			System.out.println("getSelectAll is failed");
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return list;
	}
	
	public ReservationDTO getSelectOne(ReservationDTO dtoPm) {
		ReservationDTO dto  = new ReservationDTO();
		try {
			conn = DB.dbConn();
			String sql = "SELECT ResNo, MemberNo, StoreNo, ResComment, ResDate, ResTime, "
					+ "ResPeople, ResRegidate, ResUpdate FROM Reservation WHERE ResNo = ?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getResNo());
			rs = pstmt.executeQuery();
			if (rs.next()) {
				dto.setResNo(rs.getInt("ResNo"));
				dto.setMemberNo(rs.getInt("MemberNo"));
				dto.setStoreNo(rs.getInt("StoreNo"));
				dto.setResComment(rs.getString("ResComment"));
				dto.setResDate(rs.getString("ResDate"));
				dto.setResTime(rs.getString("ResTime"));
				dto.setResPeople(rs.getString("ResPeople"));
				dto.setResRegidate(rs.getDate("ResRegidate"));
				dto.setResUpdate(rs.getDate("ResUpdate"));
			}
		} catch (Exception e) {
			System.out.println("getSelectOne is failed");
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return dto;
	}
	
	public int setInsert(ReservationDTO dtoPm) {
		int result = 0;
		try {
			conn = DB.dbConn();
			String sql = "INSERT INTO Reservation (ResNo, MemberNo, StoreNo, ResComment, "
					+ "ResDate, ResTime, ResPeople, ResRegidate, ResUpdate ) "
					+ "VALUES (SEQ_RESNO.NEXTVAL, ?, ?, ?, ?, ?, ?, SYSDATE, SYSDATE)";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getMemberNo());
			pstmt.setInt(2, dtoPm.getStoreNo());
			pstmt.setString(3, dtoPm.getResComment());
			pstmt.setString(4, dtoPm.getResDate());
			pstmt.setString(5, dtoPm.getResTime());
			pstmt.setString(6, dtoPm.getResPeople());
			result = pstmt.executeUpdate();
		} catch (Exception e) {
			result = 0;
			e.printStackTrace();
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return result;
	}
	
	public int setUpdate(ReservationDTO dtoPm) {
		int result = 0;
		try {
			conn = DB.dbConn();
			String sql = "UPDATE RESERVATION SET ResComment = ?, ResDate = ?, ResTime = ?, "
					+ "ResPeople = ?, ResUpdate = SYSDATE WHERE ResNo = ?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, dtoPm.getResComment());
			pstmt.setString(2, dtoPm.getResDate());
			pstmt.setString(3, dtoPm.getResTime());
			pstmt.setString(4, dtoPm.getResPeople());
			pstmt.setInt(5, dtoPm.getResNo());
			result = pstmt.executeUpdate();
		} catch (Exception e) {
			result = 0;
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return result;
	}
	
	public int setDelete(ReservationDTO dtoPm) {
		int result = 0;
		try {
			conn = DB.dbConn();
			String sql = "DELETE FROM Reservation WHERE ResNo = ?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getResNo());
			result = pstmt.executeUpdate();
		} catch (Exception e) {
			result = 0;
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return result;
	}
	
	// Review
	public List<ReviewDTO> getSelectAllReview(StoreDTO dtoPm) {
		List<ReviewDTO> list = new ArrayList<>();
		try {
			conn = DB.dbConn();
			String sql = "SELECT ReviewNo, ReviewTitle, ReviewContent, ReviewEstimation, ReviewRecommendation, "
					+ "ReviewImage, ReviewRegidate, ReviewUpdate, R.MemberNo, MemberNickname, MemberImage "
					+ "FROM REVIEW R INNER JOIN MEMBER M ON R.MemberNo = M.MemberNo "
					+ "WHERE StoreNo = ? ORDER BY ReviewRegidate DESC";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getStoreNo());
			rs = pstmt.executeQuery();
			while (rs.next()) {
				ReviewDTO dto = new ReviewDTO();
				dto.setReviewNo(rs.getInt("ReviewNo"));
				dto.setReviewTitle(rs.getString("ReviewTitle"));
				dto.setReviewContent(rs.getString("ReviewContent"));
				dto.setReviewEstimation(rs.getInt("ReviewEstimation"));
				dto.setReviewRecommendation(rs.getInt("ReviewRecommendation"));
				dto.setReviewImage(rs.getString("ReviewImage"));
				dto.setReviewRegidate(rs.getDate("ReviewRegidate"));
				dto.setReviewUpdate(rs.getDate("ReviewUpdate"));
				dto.setStoreNo(dtoPm.getStoreNo());
				dto.setMemberNo(rs.getInt("MemberNo"));
				dto.setMemberNickname(rs.getString("MemberNickname"));
				dto.setMemberImage(rs.getString("MemberImage"));
				list.add(dto);
			}
		} catch (Exception e) {
			System.out.println("getSelectAll is failed");
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return list;
	}
	
	public ReviewDTO getSelectOne(ReviewDTO dtoPm) {
		ReviewDTO dto  = new ReviewDTO();
		try {
			conn = DB.dbConn();
			String sql = "SELECT ReviewTitle, ReviewContent, ReviewEstimation, "
					+ "ReviewRecommendation, ReviewImage, ReviewRegidate, ReviewUpdate, "
					+ "StoreNo, MemberNo FROM Review WHERE ReviewNo = ?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getReviewNo());
			rs = pstmt.executeQuery();
			if (rs.next()) {
				dto.setReviewNo(dtoPm.getReviewNo());
				dto.setReviewTitle(rs.getString("ReviewTitle"));
				dto.setReviewContent(rs.getString("ReviewContent"));
				dto.setReviewEstimation(rs.getInt("ReviewEstimation"));
				dto.setReviewRecommendation(rs.getInt("ReviewRecommendation"));
				dto.setReviewImage(rs.getString("ReviewImage"));
				dto.setReviewRegidate(rs.getDate("ReviewRegidate"));
				dto.setReviewUpdate(rs.getDate("ReviewUpdate"));
				dto.setStoreNo(rs.getInt("StoreNo"));
				dto.setMemberNo(rs.getInt("MemberNo"));
			}
		} catch (Exception e) {
			System.out.println("getSelectOne is failed");
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return dto;
	}
	
	public ReviewDTO getReviewAvg(StoreDTO dtoPm) {
		ReviewDTO dto  = new ReviewDTO();
		try {
			conn = DB.dbConn();
			String sql = "SELECT AVG(ReviewEstimation) as ReviewEstimation, COUNT(ReviewEstimation) as ReviewCount "
					+ "FROM Review WHERE StoreNo = ?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getStoreNo());
			rs = pstmt.executeQuery();
			if (rs.next()) {
				dto.setReviewEstimation(rs.getFloat("ReviewEstimation"));
				dto.setReviewCount(rs.getInt("ReviewCount"));
			}
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("getSelectOne is failed");
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return dto;
	}
	
	public int setInsert(ReviewDTO dtoPm) {
		int result = 0;
		try {
			conn = DB.dbConn();
			String sql = "INSERT INTO Review (ReviewNo, StoreNo, MemberNo, ReviewTitle, ReviewContent, ReviewEstimation, "
					+ "ReviewRecommendation, ReviewImage, ResNo, ReviewRegidate, ReviewUpdate) "
					+ "VALUES (SEQ_ReviewNo.NEXTVAL, ?, ?, ?, ?, ?, 0, ?, ?, SYSDATE, SYSDATE)";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getStoreNo());
			pstmt.setInt(2, dtoPm.getMemberNo());
			pstmt.setString(3, dtoPm.getReviewTitle());
			pstmt.setString(4, dtoPm.getReviewContent());
			pstmt.setFloat(5, dtoPm.getReviewEstimation());
			pstmt.setString(6, dtoPm.getReviewImage());
			pstmt.setInt(7, dtoPm.getResNo());
			result = pstmt.executeUpdate();
		} catch (Exception e) {
			result = 0;
			e.printStackTrace();
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return result;
	}
	
	public int setUpdate(ReviewDTO dtoPm) {
		int result = 0;
		try {
			conn = DB.dbConn();
			String sql = "UPDATE Review SET ReviewTitle = ?, ReviewContent = ?, ReviewEstimation = ?, "
					+ "ReviewImage = ?, ReviewUpdate = SYSDATE WHERE ReviewNo = ? AND StoreNo = ? AND MemberNo = ?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, dtoPm.getReviewTitle());
			pstmt.setString(2, dtoPm.getReviewContent());
			pstmt.setFloat(3, dtoPm.getReviewEstimation());
			pstmt.setString(4, dtoPm.getReviewImage());
			pstmt.setInt(5, dtoPm.getReviewNo());
			pstmt.setInt(6, dtoPm.getStoreNo());
			pstmt.setInt(7, dtoPm.getMemberNo());
			result = pstmt.executeUpdate();
		} catch (Exception e) {
			result = 0;
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return result;
	}
	
	public int setDelete(ReviewDTO dtoPm) {
		int result = 0;
		try {
			conn = DB.dbConn();
			String sql = "DELETE FROM Review WHERE ReviewNo = ? AND StoreNo = ? AND MemberNo = ?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getReviewNo());
			pstmt.setInt(2, dtoPm.getStoreNo());
			pstmt.setInt(3, dtoPm.getMemberNo());
			result = pstmt.executeUpdate();
		} catch (Exception e) {
			result = 0;
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return result;
	}
}
