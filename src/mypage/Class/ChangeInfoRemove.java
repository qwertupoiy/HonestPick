package mypage.Class;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import member.dao.MemberDAO;
import member.dto.MemberDTO;
import mypage.controller.MypageCommand;

public class ChangeInfoRemove implements MypageCommand {
	    public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
	    	String MemberNo_ = request.getParameter("MemberNo");
			int MemberNo = Integer.parseInt(MemberNo_);
			
			MemberDTO dtoAg = new MemberDTO();
	        dtoAg.setMemberNo(MemberNo);
	        
	        MemberDAO dao = new MemberDAO();
	        
	        // If before_attachInfo is not existed
	        String attachPath = "C:/hp/attach" + request.getContextPath();
			String uploadPath = attachPath + "/product";
			java.io.File deleteFile = new java.io.File(uploadPath + "/" + dao.getSelectOne(dtoAg).getMemberImage().split("[|]")[1]);
        	if(deleteFile.exists()) {
        		deleteFile.delete();
        		System.out.println("fileDelete Success");
        	} else {
        		System.out.println("fileDelete Fail");
        		return;
        	}
        	
	        int result = dao.setDelete(dtoAg);
	        
	        HttpSession session = request.getSession();
	        if (result > 0) {
	            System.out.println("success");
	            session.setAttribute("alertMsg", "탈퇴 완료되었습니다.");
	            response.sendRedirect(path + "/Member_servlet/logout.do");
	        } else {
	            System.out.println("fail");
	            session.setAttribute("alertMsg", "회원 정보삭제에 실패하였습니다.");
	            response.sendRedirect(path + "/Mypage_servlet/changeInfo.do?MemberNo=" + MemberNo);
	        }
	    }
	}