package mypage.Class;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import member.dao.MemberDAO;
import member.dto.MemberDTO;
import mypage.controller.MypageCommand;

public class ChangeInfo implements MypageCommand {
	    public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
	    	int MemberNo = Integer.parseInt(request.getParameter("MemberNo"));
			
			// MemberNo check
			HttpSession session = request.getSession();
			int sessMemberNo = (int) session.getAttribute("MemberNo");
			if (sessMemberNo != MemberNo) {
				response.sendRedirect(path + "/Home_servlet/home.do");
				return;
			}
	    	
			MemberDTO dtoAg = new MemberDTO();
			dtoAg.setMemberNo(MemberNo);
	        
	        MemberDAO dao = new MemberDAO();
	        MemberDTO dtoResult = dao.getSelectOne(dtoAg);
	        
	        String memberImage = dtoResult.getMemberImage();
        	
        	if (memberImage == null || memberImage.equals("-")) {
        		dtoResult.setMemberImage("member_none.jpg");
        	} else {
        		String[] partsImage = dtoResult.getMemberImage().split("\\|");
        		if (partsImage.length > 1) {
        			dtoResult.setMemberImage(partsImage[1]);
        		} else {
        			dtoResult.setMemberImage(partsImage[0]);
        		}
        	}
	        
	        request.setAttribute("dtoResult", dtoResult);	        
	    	
	        RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/page/myPage/changeInfo.jsp");
	        rd.forward(request, response);
	    }
	}