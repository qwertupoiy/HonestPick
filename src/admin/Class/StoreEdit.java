package admin.Class;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import admin.controller.AdminCommand;
import store.dao.StoreDAO;
import store.dto.StoreDTO;

public class StoreEdit implements AdminCommand {
	public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
		int StoreNo = Integer.parseInt(request.getParameter("StoreNo"));
		
		StoreDTO dtoAg = new StoreDTO();
		dtoAg.setStoreNo(StoreNo);
		
		StoreDAO dao = new StoreDAO();
		
		// Store owner check
		HttpSession session = request.getSession();
		int sessMemberNo = (int) session.getAttribute("MemberNo");
		if (dao.getSelectOne(dtoAg).getMemberNo() != sessMemberNo) {
			response.sendRedirect(path + "/Home_servlet/home.do");
			return;
		}
		
		StoreDTO dtoStore = dao.getSelectOne(dtoAg);
		
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

		request.setAttribute("dtoStore", dtoStore);
		request.setAttribute("Facilities", Facilities);
		request.setAttribute("listSchedule", listSchedule);
		
		RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/page/admin/storeEdit.jsp");
        rd.forward(request, response);
    }
}
