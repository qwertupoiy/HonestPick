package store.Class;

import java.io.IOException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import admin.dao.AdminDAO;
import admin.dto.AdvertisementDTO;
import member.dto.MemberDTO;
import mypage.dao.MypageDAO;
import mypage.dto.WishListDTO;
import member.dao.MemberDAO;
import store.dao.StoreDAO;
import store.dto.MenuDTO;
import store.dto.ReviewDTO;
import store.dto.StoreDTO;

public class RestaurantDetail {
	public void process(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
		int StoreNo = Integer.parseInt(request.getParameter("StoreNo"));
		
		StoreDTO dtoAg = new StoreDTO();
		dtoAg.setStoreNo(StoreNo);
		
		StoreDAO daoStore = new StoreDAO();
		StoreDTO dtoStore = daoStore.getSelectOne(dtoAg);
		
		String StorefileName;
		if (dtoStore.getStoreImage().equals("-")) {
			StorefileName = "none.jpg";
			dtoStore.setStoreImage(StorefileName);
		} else {
			StorefileName = dtoStore.getStoreImage().split("[|]")[1];
			dtoStore.setStoreImage(StorefileName);
		}
		
		String[] Schedule = dtoStore.getStoreSchedule().split(", ");
		String[] Facilities = dtoStore.getStoreFacilities().split(", ");
		
		List<String> listSchedule = new ArrayList<>();
		String[] day = new String[] {"월", "화", "수", "목", "금", "토", "일"};
		
		for (int i = 0; i < Schedule.length; i++) {
			String[] OnOff = Schedule[i].split(" ");
			if (OnOff[1].equals("휴무")) {
				listSchedule.add("휴무");
				listSchedule.add("휴무");
			} else {
				listSchedule.add(OnOff[1].split("-")[0]);
				listSchedule.add(OnOff[1].split("-")[1]);
			}
		}
		
		// MenuMax
		String priceMax = dtoStore.getMenu().getMenuMax();
		if (priceMax != null && !priceMax.trim().isEmpty()) {
		    try {
		        // 기존 쉼표 제거 후 정수로 파싱
		        int price = Integer.parseInt(priceMax.replaceAll(",", ""));
		        
		        // 천 단위 쉼표 포맷 적용
		        DecimalFormat formatter = new DecimalFormat("#,###");
		        String formattedPrice = formatter.format(price);
		        
		        // 다시 저장
		        dtoStore.getMenu().setMenuMax(formattedPrice);
		    } catch (NumberFormatException e) {
		        System.err.println("금액 형식 오류: " + priceMax);
		    }
		} else {
			dtoStore.getMenu().setMenuMax("0");
		    System.err.println("금액이 null이거나 비어 있습니다: " + priceMax);
		}
		// MenuMin
		String priceMin = dtoStore.getMenu().getMenuMin();
		if (priceMin != null && !priceMin.trim().isEmpty()) {
		    try {
		        // 기존 쉼표 제거 후 정수로 파싱
		        int price = Integer.parseInt(priceMin.replaceAll(",", ""));
		        
		        // 천 단위 쉼표 포맷 적용
		        DecimalFormat formatter = new DecimalFormat("#,###");
		        String formattedPrice = formatter.format(price);
		        
		        // 다시 저장
		        dtoStore.getMenu().setMenuMin(formattedPrice);
		    } catch (NumberFormatException e) {
		        System.err.println("금액 형식 오류: " + priceMin);
		    }
		} else {
			dtoStore.getMenu().setMenuMin("0");
		    System.err.println("금액이 null이거나 비어 있습니다: " + priceMin);
		}
		
		MemberDTO dtoMember = new MemberDTO();
		dtoMember.setMemberNo(dtoStore.getMemberNo());
		
		MemberDAO daoMember = new MemberDAO();
		String MemberName = daoMember.getSelectOne(dtoMember).getMemberName();
		int MemberNo = daoMember.getSelectOne(dtoMember).getMemberNo();

		request.setAttribute("dtoStore", dtoStore);
		request.setAttribute("Facilities", Facilities);
		request.setAttribute("listSchedule", listSchedule);
		request.setAttribute("day", day);
		request.setAttribute("MemberName", MemberName);
		request.setAttribute("MemberNo", MemberNo);
		
		
		// ResNo for Review
		String ResNo_ = request.getParameter("ResNo");
		int ResNo = 0;
		try {
			ResNo = Integer.parseInt(ResNo_);
		} catch (Exception e) {
			ResNo = 0;
		}
		
		request.setAttribute("ResNo", ResNo);
		
		// Menu
		List<MenuDTO> listMenu = daoStore.getSelectAllMenu(dtoAg);
		
		for (int i = 0; i < listMenu.size(); i++) {
			// MenuPrice
		    String priceStr = listMenu.get(i).getMenuPrice();
		    try {
		        // 기존 쉼표 제거 후 정수로 파싱
		        int price = Integer.parseInt(priceStr.replaceAll(",", ""));
		        
		        // 천 단위 쉼표 포맷 적용
		        DecimalFormat formatter = new DecimalFormat("#,###");
		        String formattedPrice = formatter.format(price);
		        
		        // 다시 저장
		        listMenu.get(i).setMenuPrice(formattedPrice);
		    } catch (NumberFormatException e) {
		        System.err.println("금액 형식 오류: " + priceStr);
		    }
			
			String MenufileName;
			if (listMenu.get(i).getMenuImage().equals("-")) {
				MenufileName = "none.jpg";
				listMenu.get(i).setMenuImage(MenufileName);
			} else {
				MenufileName = listMenu.get(i).getMenuImage().split("[|]")[1];
				listMenu.get(i).setMenuImage(MenufileName);
			}
		}
		
		request.setAttribute("listMenu", listMenu);
		
		// ReviewEstimation
		ReviewDTO ReviewAvg = daoStore.getReviewAvg(dtoAg);
		
		request.setAttribute("ReviewAvg", ReviewAvg);
		
		// ReviewList
		List<ReviewDTO> listReview = daoStore.getSelectAllReview(dtoAg);
		
		for (int i = 0; i < listReview.size(); i++) {
			String ReviewfileName;
			if (listReview.get(i).getReviewImage().equals("-")) {
				ReviewfileName = "none.jpg";
				listReview.get(i).setReviewImage(ReviewfileName);
			} else {
				ReviewfileName = listReview.get(i).getReviewImage().split("[|]")[1];
				listReview.get(i).setReviewImage(ReviewfileName);
			}
			
			String MemberfilaName;
			if (listReview.get(i).getMemberImage().equals("-")) {
				MemberfilaName = "none.jpg";
				listReview.get(i).setMemberImage(MemberfilaName);
			} else {
				MemberfilaName = listReview.get(i).getMemberImage().split("[|]")[1];
				listReview.get(i).setMemberImage(MemberfilaName);
			}
		}

		request.setAttribute("listReview", listReview);
		
		// WishList
		HttpSession session = request.getSession();
		Integer sessMemberNo = (Integer) session.getAttribute("MemberNo");
		
		if (sessMemberNo != null) {
			WishListDTO dtoWish = new WishListDTO();
			dtoWish.setStoreNo(StoreNo);
			dtoWish.setMemberNo(sessMemberNo);
			
			MypageDAO daoWish = new MypageDAO();
			dtoWish = daoWish.getSelectOne(dtoWish);
			
			String wish = "X";
			if (dtoWish != null && dtoWish.getWishNo() != null) {
				wish = "O";
			}
			
			request.setAttribute("wish", wish);
		}
		
		// Selecting Random Ads
		AdminDAO daoAds = new AdminDAO();
		List<AdvertisementDTO> listAds = daoAds.RandomAds(2);
		
		for(int i = 0; i < listAds.size(); i++) {
			String adImage = listAds.get(i).getAdImage();
			if (adImage == null || adImage.equals("none.jpg") || adImage.isEmpty()) {
				listAds.get(i).setAdImage("none.jpg");
	    	} else {
	    		String[] partsImage = adImage.split("\\|");
	    		if (partsImage.length > 1) {
	    			listAds.get(i).setAdImage(partsImage[1]);
	    		} else {
	    			listAds.get(i).setAdImage(partsImage[0]);
	    		}
	    	}
		}
		
		request.setAttribute("listAds", listAds);
		
        RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/page/store/restaurantDetail.jsp");
        rd.forward(request, response);
    }
}
