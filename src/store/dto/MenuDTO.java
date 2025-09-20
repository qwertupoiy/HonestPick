package store.dto;

import java.sql.Date;

public class MenuDTO {
	private int MenuNo;
	private int StoreNo;
	private String MenuName;
	private String MenuPrice;
	private String MenuMax;
	private String MenuMin;
	private String MenuImage;
	private String MenuDescription;
	private Date MenuRegidate;
	private Date MenuUpdate;
	
	public int getMenuNo() {
		return MenuNo;
	}
	public void setMenuNo(int menuNo) {
		MenuNo = menuNo;
	}
	public int getStoreNo() {
		return StoreNo;
	}
	public void setStoreNo(int storeNo) {
		StoreNo = storeNo;
	}
	public String getMenuName() {
		return MenuName;
	}
	public void setMenuName(String menuName) {
		MenuName = menuName;
	}
	public String getMenuPrice() {
		return MenuPrice;
	}
	public void setMenuPrice(String menuPrice) {
		MenuPrice = menuPrice;
	}
	public String getMenuMax() {
		return MenuMax;
	}
	public void setMenuMax(String menuMax) {
		MenuMax = menuMax;
	}
	public String getMenuMin() {
		return MenuMin;
	}
	public void setMenuMin(String menuMin) {
		MenuMin = menuMin;
	}
	public String getMenuImage() {
		return MenuImage;
	}
	public void setMenuImage(String menuImage) {
		MenuImage = menuImage;
	}
	public String getMenuDescription() {
		return MenuDescription;
	}
	public void setMenuDescription(String menuDescription) {
		MenuDescription = menuDescription;
	}
	public Date getMenuRegidate() {
		return MenuRegidate;
	}
	public void setMenuRegidate(Date menuRegidate) {
		MenuRegidate = menuRegidate;
	}
	public Date getMenuUpdate() {
		return MenuUpdate;
	}
	public void setMenuUpdate(Date menuUpdate) {
		MenuUpdate = menuUpdate;
	}
}