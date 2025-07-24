package store.Class;

import java.io.IOException;
import java.text.DecimalFormat;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import admin.dao.AdminDAO;
import admin.dto.AdvertisementDTO;
import store.dao.StoreDAO;
import store.dto.StoreDTO;

public class StoreList {
	public void process(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
		StoreDAO dao = new StoreDAO();
		StoreDTO dtoAg = new StoreDTO();
		List<StoreDTO> listStore;
		int count = 0;
		
		// search
		String searchKeyword = request.getParameter("searchKeyword");
	      if (searchKeyword == null) {
	         listStore = dao.getSelectMembership();
	         count = listStore.size();
	         listStore = dao.getSelectAll(listStore);
	         count = listStore.size() - count;
	         searchKeyword = "맛집 검색";
	      } else {
	         dtoAg.setStoreName(searchKeyword);
	         listStore = dao.getSelectSearch(dtoAg);
	         count = listStore.size();
	      }
		
		for (int i = 0; i < listStore.size(); i++) {
			// Image
			String fileName;
			if (listStore.get(i).getStoreImage().equals("-")) {
				fileName = "none.jpg";
				listStore.get(i).setStoreImage(fileName);
			} else {
				fileName = listStore.get(i).getStoreImage().split("[|]")[1];
				listStore.get(i).setStoreImage(fileName);
			}
			
			// Price format
			String priceMax = listStore.get(i).getMenu().getMenuMax();
			if (priceMax != null && !priceMax.trim().isEmpty()) {
			    try {
			        // 기존 쉼표 제거 후 정수로 파싱
			        int price = Integer.parseInt(priceMax.replaceAll(",", ""));
			        
			        // 천 단위 쉼표 포맷 적용
			        DecimalFormat formatter = new DecimalFormat("#,###");
			        String formattedPrice = formatter.format(price);
			        
			        // 다시 저장
			        listStore.get(i).getMenu().setMenuMax(formattedPrice);
			    } catch (NumberFormatException e) {
			        System.err.println("금액 형식 오류: " + priceMax);
			    }
			} else {
				listStore.get(i).getMenu().setMenuMax("0");
			    System.err.println("금액이 null이거나 비어 있습니다: " + priceMax);
			}
			
			String priceMin = listStore.get(i).getMenu().getMenuMin();
			if (priceMin != null && !priceMin.trim().isEmpty()) {
			    try {
			        // 기존 쉼표 제거 후 정수로 파싱
			        int price = Integer.parseInt(priceMin.replaceAll(",", ""));
			        
			        // 천 단위 쉼표 포맷 적용
			        DecimalFormat formatter = new DecimalFormat("#,###");
			        String formattedPrice = formatter.format(price);
			        
			        // 다시 저장
			        listStore.get(i).getMenu().setMenuMin(formattedPrice);
			    } catch (NumberFormatException e) {
			        System.err.println("금액 형식 오류: " + priceMin);
			    }
			} else {
				listStore.get(i).getMenu().setMenuMin("0");
			    System.err.println("금액이 null이거나 비어 있습니다: " + priceMin);
			}
			
			// Schedule
			String[] Schedule = listStore.get(i).getStoreSchedule().split(", ");
			
			List<String> listOpen = new ArrayList<>();
			List<String> listClose = new ArrayList<>();
			int Operating = 0;
			for (int k = 0; k < Schedule.length; k++) {
				String[] OnOff = Schedule[k].split(" ");
				if (!OnOff[1].equals("휴무")) {
					listOpen.add(OnOff[1].split("-")[0]);
					listClose.add(OnOff[1].split("-")[1]);
				} else {
					if (k == 5 || k == 6) {Operating++;}
				}
			}
			
			// OperatingDays
			List<String> OperatingDays = new ArrayList<>();
			OperatingDays.add("주중");
			if (Operating < 2) {
				OperatingDays.add("주말");
			}
			
			listStore.get(i).setOperatingDays(OperatingDays);
			
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");

	        // 가장 빠른 시간 찾기
	        String earliestTime = listOpen.stream()
	            .map((String time) -> LocalTime.parse(time, formatter))   // 문자열 -> LocalTime
	            .min(Comparator.naturalOrder())                           // 최솟값
	            .map((LocalTime time) -> time.format(formatter))          // 다시 문자열로 변환
	            .orElse("N/A");
	        
	        // 가장 늦은 시간 찾기
	        String latestTime = listClose.stream()
                .max(Comparator.comparingDouble(time -> {
                    LocalTime t = LocalTime.parse(time, formatter);
                    double hourValue = t.getHour() + t.getMinute() / 60.0;

                    // 00:00 ~ 05:59 은 다음 날 새벽으로 간주 → +24시간
                    if (hourValue < 6.0) {
                        hourValue += 24;
                    }
                    return hourValue;
                }))
                .orElse("N/A");

	        listStore.get(i).setOpenTime(earliestTime);
	        listStore.get(i).setCloseTime(latestTime);
			
			// Facilities
	        listStore.get(i).setFacilities(Arrays.asList(
	        	    listStore.get(i).getStoreFacilities().split(", ")));
        
	        // Status
	        String BusinessStatus = "영업중";
	        
	        listStore.get(i).setBusinessStatus(BusinessStatus);
		}
		
		// Selecting Random Ads
		AdminDAO daoAds = new AdminDAO();
		List<AdvertisementDTO> listAds = daoAds.RandomAds(3);
		
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
		request.setAttribute("listStore", listStore);
		request.setAttribute("count", count);
		request.setAttribute("searchKeyword", searchKeyword);
		
        RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/page/store/storeList.jsp");
        rd.forward(request, response);
    }
}