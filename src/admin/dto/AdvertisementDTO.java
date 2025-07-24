package admin.dto;

import java.sql.Date;

public class AdvertisementDTO {
	private int AdNo;
	private String AdTitle;
	private String AdImage;
	private Date AdRegidate;
	private int period;
	private Date AdStartDate;
	private Date AdEndDate;
	private int remaining_days;
	private String check_finish;
	private String description;
	
	public Date getAdStartDate() {
		return AdStartDate;
	}
	public void setAdStartDate(Date adStartDate) {
		AdStartDate = adStartDate;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getCheck_finish() {
		return check_finish;
	}
	public void setCheck_finish(String check_finish) {
		this.check_finish = check_finish;
	}
	public int getRemaining_days() {
		return remaining_days;
	}
	public void setRemaining_days(int remaining_days) {
		this.remaining_days = remaining_days;
	}
	public int getPeriod() {
		return period;
	}
	public void setPeriod(int period) {
		this.period = period;
	}
	public int getAdNo() {
		return AdNo;
	}
	public void setAdNo(int adNo) {
		AdNo = adNo;
	}
	public String getAdTitle() {
		return AdTitle;
	}
	public void setAdTitle(String adTitle) {
		AdTitle = adTitle;
	}
	public String getAdImage() {
		return AdImage;
	}
	public void setAdImage(String adImage) {
		AdImage = adImage;
	}
	public Date getAdRegidate() {
		return AdRegidate;
	}
	public void setAdRegidate(Date adRegidate) {
		AdRegidate = adRegidate;
	}
	public Date getAdEndDate() {
		return AdEndDate;
	}
	public void setAdEndDate(Date adEndDate) {
		AdEndDate = adEndDate;
	}
	
	
}
